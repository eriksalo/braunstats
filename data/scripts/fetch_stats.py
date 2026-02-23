"""
BraunStats Data Pipeline
Fetches Christian Braun stats from NBA API and outputs static JSON files.
"""

import json
import time
import os
from datetime import datetime, timezone

from nba_api.stats.endpoints import (
    CommonPlayerInfo,
    PlayerGameLog,
    TeamPlayerOnOffDetails,
    TeamDashLineups,
    PlayerDashboardByGeneralSplits,
    PlayerDashboardByShootingSplits,
    PlayerDashboardByYearOverYear,
)

BRAUN_ID = 1631128
JOKIC_ID = 203999
NUGGETS_ID = 1610612743
SEASONS = ["2022-23", "2023-24", "2024-25", "2025-26"]

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.nba.com/",
    "Origin": "https://www.nba.com",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "x-nba-stats-origin": "stats",
    "x-nba-stats-token": "true",
}

MAX_RETRIES = 3
TIMEOUT = 60


def api_delay():
    time.sleep(4.0)


def retry_call(fn, **kwargs):
    kwargs.setdefault("headers", HEADERS)
    kwargs.setdefault("timeout", TIMEOUT)
    for attempt in range(MAX_RETRIES):
        try:
            return fn(**kwargs)
        except Exception as e:
            print(f"    Attempt {attempt + 1}/{MAX_RETRIES} failed: {type(e).__name__}: {e}")
            if attempt < MAX_RETRIES - 1:
                wait = 5 * (attempt + 1)
                print(f"    Retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise


def write_json(filename, data, season=None):
    output = {
        "meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "season": season,
        },
        "data": data,
    }
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"  -> Wrote {filename}")


def rows_to_dicts(result_set):
    headers = result_set["headers"]
    rows = result_set["rowSet"]
    return [dict(zip(headers, row)) for row in rows]


def fetch_player_overview():
    print("Fetching player overview...")
    resp = retry_call(CommonPlayerInfo, player_id=BRAUN_ID)
    raw = resp.get_normalized_dict()
    info = raw["CommonPlayerInfo"][0] if raw["CommonPlayerInfo"] else {}
    headline = raw["PlayerHeadlineStats"][0] if raw["PlayerHeadlineStats"] else {}
    write_json("player_overview.json", {"info": info, "headline": headline})
    api_delay()


def fetch_game_logs():
    print("Fetching game logs...")
    all_games = []
    for season in SEASONS:
        for season_type in ["Regular Season", "Playoffs"]:
            label = f"{season} ({season_type})"
            print(f"  {label}...")
            try:
                resp = retry_call(
                    PlayerGameLog,
                    player_id=BRAUN_ID,
                    season=season,
                    season_type_all_star=season_type,
                )
                raw = resp.get_dict()
                result_set = raw["resultSets"][0]
                games = rows_to_dicts(result_set)
                for g in games:
                    g["SEASON"] = season
                    g["SEASON_TYPE"] = season_type
                all_games.extend(games)
                print(f"    Found {len(games)} games")
            except Exception as e:
                print(f"    Warning: {e}")
            api_delay()

    write_json("game_log.json", {"games": all_games})


def fetch_on_off_jokic():
    print("Fetching Jokic on/off data...")
    on_off_data = {}

    for season in SEASONS:
        if season not in on_off_data:
            on_off_data[season] = {}

        for measure in ["Base", "Advanced"]:
            print(f"  Season {season} ({measure})...")
            try:
                resp = retry_call(
                    TeamPlayerOnOffDetails,
                    team_id=NUGGETS_ID,
                    season=season,
                    measure_type_detailed=measure,
                )
                raw = resp.get_dict()
                on_set = raw["resultSets"][0]
                off_set = raw["resultSets"][1]
                on_rows = rows_to_dicts(on_set)
                off_rows = rows_to_dicts(off_set)

                jokic_on = next(
                    (r for r in on_rows if r.get("VS_PLAYER_ID") == JOKIC_ID), None
                )
                jokic_off = next(
                    (r for r in off_rows if r.get("VS_PLAYER_ID") == JOKIC_ID), None
                )
                on_off_data[season][measure.lower()] = {
                    "jokic_on": jokic_on,
                    "jokic_off": jokic_off,
                }
            except Exception as e:
                print(f"    Warning: {e}")
            api_delay()

    # Fetch lineup pair stats (Braun + Jokic together)
    print("Fetching lineup pair data...")
    lineup_pairs = {}
    for season in SEASONS:
        print(f"  Season {season} lineups...")
        try:
            resp = retry_call(
                TeamDashLineups,
                team_id=NUGGETS_ID,
                season=season,
                group_quantity=2,
            )
            raw = resp.get_dict()
            lineups_set = raw["resultSets"][0]
            lineups = rows_to_dicts(lineups_set)

            braun_jokic_pair = None
            for lineup in lineups:
                group_set = lineup.get("GROUP_SET", "")
                group_id = lineup.get("GROUP_ID", "")
                ids = str(group_id).split("-") if group_id else []
                names = group_set if group_set else ""
                if (str(BRAUN_ID) in ids and str(JOKIC_ID) in ids) or (
                    "Braun" in names and "Jokic" in names
                ):
                    braun_jokic_pair = lineup
                    break
            lineup_pairs[season] = braun_jokic_pair
        except Exception as e:
            print(f"    Warning: {e}")
        api_delay()

    write_json(
        "on_off_jokic.json",
        {"on_off": on_off_data, "lineup_pairs": lineup_pairs},
    )


def fetch_general_splits():
    print("Fetching general splits...")
    splits_data = {}

    for season in SEASONS:
        print(f"  Season {season}...")
        try:
            resp = retry_call(
                PlayerDashboardByGeneralSplits,
                player_id=BRAUN_ID,
                season=season,
            )
            raw = resp.get_dict()
            result_sets = {}
            for rs in raw["resultSets"]:
                result_sets[rs["name"]] = rows_to_dicts(rs)

            splits_data[season] = {
                "overall": result_sets.get("OverallPlayerDashboard", []),
                "location": result_sets.get("LocationPlayerDashboard", []),
                "win_loss": result_sets.get("WinsLossesPlayerDashboard", []),
                "month": result_sets.get("MonthPlayerDashboard", []),
                "pre_post_allstar": result_sets.get("PrePostAllStarPlayerDashboard", []),
                "starter_bench": result_sets.get(
                    "StartingPosition",
                    result_sets.get("StarterBenchPlayerDashboard", []),
                ),
                "days_rest": result_sets.get("DaysRestPlayerDashboard", []),
            }
        except Exception as e:
            print(f"    Warning: {e}")
        api_delay()

    write_json("general_splits.json", splits_data)


def fetch_shooting_splits():
    print("Fetching shooting splits...")
    shooting_data = {}

    for season in SEASONS:
        print(f"  Season {season}...")
        try:
            resp = retry_call(
                PlayerDashboardByShootingSplits,
                player_id=BRAUN_ID,
                season=season,
            )
            raw = resp.get_dict()
            result_sets = {}
            for rs in raw["resultSets"]:
                result_sets[rs["name"]] = rows_to_dicts(rs)

            shooting_data[season] = {
                "shot_type": result_sets.get("ShotTypePlayerDashboard", []),
                "shot_area": result_sets.get("ShotAreaPlayerDashboard", []),
                "distance": result_sets.get("OverallPlayerDashboard", []),
                "assisted": result_sets.get(
                    "AssistedBy",
                    result_sets.get("AssistedShotPlayerDashboard", []),
                ),
            }
        except Exception as e:
            print(f"    Warning: {e}")
        api_delay()

    write_json("shooting_splits.json", shooting_data)


def fetch_career():
    print("Fetching career year-over-year...")
    career_data = {}

    for measure in ["Base", "Advanced"]:
        print(f"  {measure}...")
        try:
            resp = retry_call(
                PlayerDashboardByYearOverYear,
                player_id=BRAUN_ID,
                measure_type_detailed=measure,
            )
            raw = resp.get_dict()
            for rs in raw["resultSets"]:
                if rs["name"] == "ByYearPlayerDashboard":
                    career_data[measure.lower()] = rows_to_dicts(rs)
        except Exception as e:
            print(f"    Warning ({measure}): {e}")
        api_delay()

    write_json("career.json", career_data)


def main():
    print("BraunStats Data Pipeline")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Seasons: {SEASONS}")
    print("=" * 50)

    steps = [
        ("Player Overview", fetch_player_overview),
        ("Game Logs", fetch_game_logs),
        ("Jokic On/Off", fetch_on_off_jokic),
        ("General Splits", fetch_general_splits),
        ("Shooting Splits", fetch_shooting_splits),
        ("Career", fetch_career),
    ]
    succeeded = 0
    for name, fn in steps:
        try:
            fn()
            succeeded += 1
        except Exception as e:
            print(f"  FAILED {name}: {e}")
            print(f"  Skipping and continuing...")

    print("=" * 50)
    print(f"Done! {succeeded}/{len(steps)} data files written.")


if __name__ == "__main__":
    main()
