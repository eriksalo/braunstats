"""
BraunStats — Basketball Reference Scraper (alternate data source)
Scrapes Christian Braun stats from basketball-reference.com when nba_api is blocked.
Rate limit: max 20 requests/minute (3-second delay between requests).
"""

import json
import time
import os
import re
from datetime import datetime, timezone

from io import StringIO

import requests
from bs4 import BeautifulSoup, Comment
import pandas as pd

PLAYER_SLUG = "braunch01"
PLAYER_NAME = "Christian Braun"
PLAYER_ID = 1631128
TEAM_ID = 1610612743
BASE_URL = "https://www.basketball-reference.com"
SEASONS = [2023, 2024, 2025, 2026]  # BBRef uses end year (2023 = 2022-23 season)
SEASON_LABELS = {2023: "2022-23", 2024: "2023-24", 2025: "2024-25", 2026: "2025-26"}

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}


def delay():
    time.sleep(3.5)


def write_json(filename, data, season=None):
    output = {
        "meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "season": season,
            "source": "basketball-reference.com",
        },
        "data": data,
    }
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"  -> Wrote {filename}")


def get_soup(url):
    print(f"  GET {url}")
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "lxml")


def uncomment_tables(soup):
    """BBRef hides some tables in HTML comments. Uncomment them."""
    for comment in soup.find_all(string=lambda t: isinstance(t, Comment)):
        if "<table" in str(comment):
            new_soup = BeautifulSoup(str(comment), "lxml")
            comment.replace_with(new_soup)
    return soup


def parse_table(soup, table_id):
    """Extract a table by ID into a list of dicts."""
    table = soup.find("table", {"id": table_id})
    if not table:
        print(f"    Table '{table_id}' not found")
        return []
    df = pd.read_html(StringIO(str(table)))[0]
    # Flatten multi-level columns if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = ["_".join(str(c) for c in col).strip("_") for col in df.columns]
    # Drop rows that are repeated headers (BBRef inserts header rows mid-table)
    if "Rk" in df.columns:
        df = df[df["Rk"] != "Rk"]
    return df.to_dict("records")


def parse_mp(val):
    """Parse minutes played from '29:06' format to float minutes."""
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return 0.0
    s = str(val).strip()
    if ":" in s:
        parts = s.split(":")
        return round(float(parts[0]) + float(parts[1]) / 60, 1)
    return safe_float(s)


def safe_float(val, default=0.0):
    try:
        if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
            return default
        s = str(val).strip()
        if s in ("", "nan"):
            return default
        return float(s)
    except (ValueError, TypeError):
        return default


def safe_int(val, default=0):
    try:
        if val is None or val == "" or (isinstance(val, float) and pd.isna(val)):
            return default
        return int(float(val))
    except (ValueError, TypeError):
        return default


# ─── Player Overview ───

def fetch_player_overview():
    print("Fetching player overview from BBRef...")
    soup = get_soup(f"{BASE_URL}/players/b/{PLAYER_SLUG}.html")

    info_div = soup.find("div", {"id": "meta"})
    info_text = info_div.get_text(" ", strip=True) if info_div else ""

    # Parse bio fields from individual <p> tags for better matching
    height = ""
    weight = ""
    birthdate = ""
    draft_round = "1"
    draft_number = "21"
    draft_year = "2022"

    for p in info_div.find_all("p") if info_div else []:
        pt = p.get_text(" ", strip=True)
        # Height/weight: "6-6 , 220lb (198cm, 99kg)"
        m = re.search(r"(\d+-\d+)\s*,\s*(\d+)lb", pt)
        if m:
            height = m.group(1)
            weight = m.group(2)
        # Born: "April 17 , 2001 in Burlington..."
        m = re.search(r"Born:\s*(\w+\s+\d+)\s*,\s*(\d{4})", pt)
        if m:
            birthdate = f"{m.group(1)}, {m.group(2)}"
        # Draft
        m = re.search(r"(\d+)\w+\s+round\s+\((\d+)\w+\s+pick.*?(\d{4})", pt)
        if m:
            draft_round = m.group(1)
            draft_number = m.group(2)
            draft_year = m.group(3)

    # Get career stats from per_game table on player page
    soup = uncomment_tables(soup)
    rows = parse_table(soup, "per_game_stats")
    if not rows:
        rows = parse_table(soup, "per_game")
    latest = None
    for r in rows:
        season = str(r.get("Season", ""))
        if "Career" not in season and "20" in season:
            latest = r
    print(f"  Found {len(rows)} career rows, latest: {latest.get('Season', 'N/A') if latest else 'None'}")

    headline = {}
    if latest:
        headline = {
            "PTS": safe_float(latest.get("PTS/G", latest.get("PTS", 0))),
            "AST": safe_float(latest.get("AST/G", latest.get("AST", 0))),
            "REB": safe_float(latest.get("TRB/G", latest.get("TRB", 0))),
            "PIE": 0,
            "ALL_STAR_APPEARANCES": 0,
        }

    info = {
        "PERSON_ID": PLAYER_ID,
        "FIRST_NAME": "Christian",
        "LAST_NAME": "Braun",
        "DISPLAY_FIRST_LAST": PLAYER_NAME,
        "BIRTHDATE": birthdate,
        "SCHOOL": "Kansas",
        "COUNTRY": "USA",
        "HEIGHT": height,
        "WEIGHT": weight,
        "JERSEY": "0",
        "POSITION": "Guard-Forward",
        "TEAM_ID": TEAM_ID,
        "TEAM_NAME": "Nuggets",
        "TEAM_ABBREVIATION": "DEN",
        "TEAM_CITY": "Denver",
        "FROM_YEAR": 2022,
        "TO_YEAR": 2025,
        "DRAFT_YEAR": draft_year,
        "DRAFT_ROUND": draft_round,
        "DRAFT_NUMBER": draft_number,
        "ROSTERSTATUS": "Active",
        "SEASON_EXP": 3,
    }

    write_json("player_overview.json", {"info": info, "headline": headline})
    delay()


# ─── Game Logs ───

def fetch_game_logs():
    print("Fetching game logs...")
    all_games = []

    for year in SEASONS:
        season_label = SEASON_LABELS[year]
        url = f"{BASE_URL}/players/b/{PLAYER_SLUG}/gamelog/{year}/"
        print(f"  Season {season_label}...")
        try:
            soup = get_soup(url)
            soup = uncomment_tables(soup)
            rows = parse_table(soup, "player_game_log_reg")
            if not rows:
                rows = parse_table(soup, "pgl_basic")

            for r in rows:
                date_str = str(r.get("Date", ""))
                if not re.match(r"\d{4}-\d{2}-\d{2}", date_str):
                    continue

                matchup_raw = str(r.get("Opp", ""))
                home_away = str(r.get("Unnamed: 5", ""))
                is_home = home_away != "@"
                matchup = f"DEN {'vs.' if is_home else '@'} {matchup_raw}"

                # Parse W/L from Result column: "W (+12)" or "L (-5)" or "W, 110-95"
                result_str = str(r.get("Result", ""))
                wl = "W" if result_str.startswith("W") else "L"

                game = {
                    "SEASON": season_label,
                    "SEASON_TYPE": "Regular Season",
                    "SEASON_ID": f"2{year - 1}",
                    "Player_ID": PLAYER_ID,
                    "Game_ID": str(r.get("Rk", "")),
                    "GAME_DATE": date_str,
                    "MATCHUP": matchup,
                    "WL": wl,
                    "MIN": parse_mp(r.get("MP", 0)),
                    "FGM": safe_float(r.get("FG", 0)),
                    "FGA": safe_float(r.get("FGA", 0)),
                    "FG_PCT": safe_float(r.get("FG%", 0)),
                    "FG3M": safe_float(r.get("3P", 0)),
                    "FG3A": safe_float(r.get("3PA", 0)),
                    "FG3_PCT": safe_float(r.get("3P%", 0)),
                    "FTM": safe_float(r.get("FT", 0)),
                    "FTA": safe_float(r.get("FTA", 0)),
                    "FT_PCT": safe_float(r.get("FT%", 0)),
                    "OREB": safe_float(r.get("ORB", 0)),
                    "DREB": safe_float(r.get("DRB", 0)),
                    "REB": safe_float(r.get("TRB", 0)),
                    "AST": safe_float(r.get("AST", 0)),
                    "STL": safe_float(r.get("STL", 0)),
                    "BLK": safe_float(r.get("BLK", 0)),
                    "TOV": safe_float(r.get("TOV", 0)),
                    "PF": safe_float(r.get("PF", 0)),
                    "PTS": safe_float(r.get("PTS", 0)),
                    "PLUS_MINUS": safe_float(r.get("+/-", 0)),
                    "VIDEO_AVAILABLE": 0,
                }
                all_games.append(game)
        except Exception as e:
            print(f"    Warning: {e}")
        delay()

    print(f"  Total: {len(all_games)} games")
    write_json("game_log.json", {"games": all_games})


# ─── Career Year-over-Year ───

def fetch_career():
    print("Fetching career stats...")
    soup = get_soup(f"{BASE_URL}/players/b/{PLAYER_SLUG}.html")
    soup = uncomment_tables(soup)

    per_game = parse_table(soup, "per_game_stats")
    if not per_game:
        per_game = parse_table(soup, "per_game")
    advanced = parse_table(soup, "advanced")

    base_seasons = []
    for r in per_game:
        season = str(r.get("Season", ""))
        if "Career" in season or "20" not in season:
            continue
        base_seasons.append({
            "GROUP_VALUE": season,
            "GP": safe_int(r.get("G", 0)),
            "GS": safe_int(r.get("GS", 0)),
            "MIN": safe_float(r.get("MP", 0)),
            "FGM": safe_float(r.get("FG", 0)),
            "FGA": safe_float(r.get("FGA", 0)),
            "FG_PCT": safe_float(r.get("FG%", 0)),
            "FG3M": safe_float(r.get("3P", 0)),
            "FG3A": safe_float(r.get("3PA", 0)),
            "FG3_PCT": safe_float(r.get("3P%", 0)),
            "FTM": safe_float(r.get("FT", 0)),
            "FTA": safe_float(r.get("FTA", 0)),
            "FT_PCT": safe_float(r.get("FT%", 0)),
            "OREB": safe_float(r.get("ORB", 0)),
            "DREB": safe_float(r.get("DRB", 0)),
            "REB": safe_float(r.get("TRB", 0)),
            "AST": safe_float(r.get("AST", 0)),
            "STL": safe_float(r.get("STL", 0)),
            "BLK": safe_float(r.get("BLK", 0)),
            "TOV": safe_float(r.get("TOV", 0)),
            "PF": safe_float(r.get("PF", 0)),
            "PTS": safe_float(r.get("PTS/G", r.get("PTS", 0))),
            "PLUS_MINUS": 0,
        })

    adv_seasons = []
    for r in advanced:
        season = str(r.get("Season", ""))
        if "Career" in season or "20" not in season:
            continue
        adv_seasons.append({
            "GROUP_VALUE": season,
            "GP": safe_int(r.get("G", 0)),
            "MIN": safe_float(r.get("MP", 0)),
            "OFF_RATING": safe_float(r.get("ORtg", 0)),
            "DEF_RATING": safe_float(r.get("DRtg", 0)),
            "NET_RATING": safe_float(r.get("ORtg", 0)) - safe_float(r.get("DRtg", 0)),
            "TS_PCT": safe_float(r.get("TS%", 0)),
            "EFG_PCT": safe_float(r.get("eFG%", 0)),
            "USG_PCT": safe_float(r.get("USG%", 0)),
            "PACE": 0,
            "PIE": safe_float(r.get("WS/48", 0)),
            "AST_PCT": safe_float(r.get("AST%", 0)),
            "REB_PCT": safe_float(r.get("TRB%", 0)),
            "OREB_PCT": safe_float(r.get("ORB%", 0)),
            "DREB_PCT": safe_float(r.get("DRB%", 0)),
        })

    write_json("career.json", {"base": base_seasons, "advanced": adv_seasons})
    delay()


# ─── General Splits (Home/Away from game logs) ───

def fetch_general_splits():
    """Compute splits from game log data."""
    print("Computing general splits from game logs...")
    game_log_path = os.path.join(OUTPUT_DIR, "game_log.json")
    with open(game_log_path) as f:
        games = json.load(f)["data"]["games"]

    splits_data = {}
    for season_label in SEASON_LABELS.values():
        sg = [g for g in games if g["SEASON"] == season_label]
        if not sg:
            continue

        def avg(key):
            vals = [g[key] for g in sg if g[key] is not None]
            return round(sum(vals) / len(vals), 1) if vals else 0

        def make_row(group_set, group_value, subset):
            if not subset:
                return None
            n = len(subset)
            def a(k):
                vals = [g[k] for g in subset if g[k] is not None]
                return round(sum(vals) / len(vals), 1) if vals else 0
            def pct(made_key, att_key):
                """Compute shooting % as total_made / total_attempts."""
                made = sum(g[made_key] for g in subset if g[made_key] is not None)
                att = sum(g[att_key] for g in subset if g[att_key] is not None)
                return round(made / att, 3) if att > 0 else 0
            wins = sum(1 for g in subset if g["WL"] == "W")
            return {
                "GROUP_SET": group_set,
                "GROUP_VALUE": group_value,
                "GP": n,
                "W": wins,
                "L": n - wins,
                "W_PCT": round(wins / n, 3) if n else 0,
                "MIN": a("MIN"),
                "FGM": a("FGM"), "FGA": a("FGA"),
                "FG_PCT": pct("FGM", "FGA"),
                "FG3M": a("FG3M"), "FG3A": a("FG3A"),
                "FG3_PCT": pct("FG3M", "FG3A"),
                "FTM": a("FTM"), "FTA": a("FTA"),
                "FT_PCT": pct("FTM", "FTA"),
                "OREB": a("OREB"), "DREB": a("DREB"),
                "REB": a("REB"),
                "AST": a("AST"), "TOV": a("TOV"),
                "STL": a("STL"), "BLK": a("BLK"),
                "PF": a("PF"),
                "PTS": a("PTS"),
                "PLUS_MINUS": a("PLUS_MINUS"),
            }

        overall = make_row("Overall", "Overall", sg)
        home = [g for g in sg if "vs." in g["MATCHUP"]]
        away = [g for g in sg if "@" in g["MATCHUP"]]
        wins = [g for g in sg if g["WL"] == "W"]
        losses = [g for g in sg if g["WL"] == "L"]

        # Monthly splits
        monthly = {}
        for g in sg:
            try:
                dt = datetime.strptime(g["GAME_DATE"], "%Y-%m-%d")
                month_name = dt.strftime("%B")
                monthly.setdefault(month_name, []).append(g)
            except ValueError:
                pass

        month_rows = [make_row("Month", m, gs) for m, gs in sorted(monthly.items(), key=lambda x: datetime.strptime(x[0], "%B").month) if make_row("Month", m, gs)]

        splits_data[season_label] = {
            "overall": [overall] if overall else [],
            "location": [r for r in [make_row("Location", "Home", home), make_row("Location", "Road", away)] if r],
            "win_loss": [r for r in [make_row("W/L", "Wins", wins), make_row("W/L", "Losses", losses)] if r],
            "month": month_rows,
            "pre_post_allstar": [],
            "starter_bench": [],
            "days_rest": [],
        }

    write_json("general_splits.json", splits_data)


# ─── Shooting Splits ───

def fetch_shooting_splits():
    """Fetch shooting splits from BBRef.
    The shooting table has columns with spaced-out names like S_p_l_i_t, V_a_l_u_e, F_G, etc.
    Rows are grouped by split type (Shot Distance, Shot Type, Game Location, etc.)
    with header-repeat rows (where Split="Split") between groups.
    """
    print("Fetching shooting splits...")
    shooting_data = {}

    for year in SEASONS:
        season_label = SEASON_LABELS[year]
        url = f"{BASE_URL}/players/b/{PLAYER_SLUG}/shooting/{year}/"
        print(f"  Season {season_label}...")
        try:
            soup = get_soup(url)
            table = soup.find("table", {"id": "shooting"})
            if not table:
                print("    No shooting table found")
                shooting_data[season_label] = {"shot_type": [], "shot_area": [], "distance": [], "assisted": []}
                delay()
                continue

            df = pd.read_html(StringIO(str(table)))[0]
            # Flatten multi-index if needed
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = ["_".join(str(c) for c in col).strip("_") for col in df.columns]

            # Identify column names (BBRef uses spaced-out names like S_p_l_i_t)
            cols = list(df.columns)
            # Map to clean names by finding cols containing key substrings
            def find_col(pattern):
                for c in cols:
                    c_clean = str(c).replace("_", "").lower()
                    if pattern in c_clean:
                        return c
                return None

            col_split = find_col("split") or cols[0]
            col_value = find_col("value") or cols[1]
            col_fg = find_col("fg") or cols[2] if len(cols) > 2 else None
            col_fga = find_col("fga") or cols[3] if len(cols) > 3 else None
            col_fgpct = find_col("fg%") or cols[4] if len(cols) > 4 else None

            # Parse rows into groups
            current_group = None
            groups = {}  # group_name -> list of {value, fg, fga, fg_pct}

            for _, row in df.iterrows():
                split_val = str(row.get(col_split, ""))
                value_val = str(row.get(col_value, ""))

                # Skip header-repeat rows
                if value_val.lower() in ("value", "nan", ""):
                    continue
                if split_val.lower() in ("split",):
                    continue

                # If split column has a value, it's a new group
                if split_val and split_val.lower() != "nan":
                    current_group = split_val

                if current_group and value_val and value_val.lower() != "nan":
                    groups.setdefault(current_group, [])
                    fg = safe_float(row.get(col_fg, 0)) if col_fg else 0
                    fga = safe_float(row.get(col_fga, 0)) if col_fga else 0
                    fgpct = safe_float(row.get(col_fgpct, 0)) if col_fgpct else 0
                    if fga > 0:
                        groups[current_group].append({
                            "GROUP_VALUE": value_val,
                            "FGM": fg,
                            "FGA": fga,
                            "FG_PCT": fgpct,
                        })

            # Map BBRef groups to our format
            shot_type = groups.get("Shot Type", groups.get("Shot Points", []))
            shot_area = groups.get("Shot Distance", [])
            # If we have Game Location data, use it as an approximation for "shot_area"
            if not shot_area:
                shot_area = groups.get("Game Location", [])

            n_rows = sum(len(v) for v in groups.values())
            print(f"    Found {len(groups)} groups, {n_rows} total rows")

            shooting_data[season_label] = {
                "shot_type": shot_type,
                "shot_area": shot_area,
                "distance": groups.get("Shot Distance", []),
                "assisted": [],
            }
        except Exception as e:
            print(f"    Warning: {e}")
            import traceback
            traceback.print_exc()
            shooting_data[season_label] = {"shot_type": [], "shot_area": [], "distance": [], "assisted": []}
        delay()

    write_json("shooting_splits.json", shooting_data)


# ─── On/Off (team-level when Jokic on/off) ───

def fetch_on_off_jokic():
    """Fetch Jokic on/off court data from BBRef.
    BBRef on-off page has a single table with id='on-off' containing:
    - Row 0: "On Court" (team stats when Jokic plays)
    - Row 1: "Off Court" (team stats when Jokic sits)
    - Row 2: "On - Off" (difference)
    Columns are multi-index: (Team/Opponent/Difference) x (eFG%, ORB%, DRB%, TRB%, AST%, STL%, BLK%, TOV%, ORtg)
    Plus: Split, Tm, MP
    """
    print("Fetching Jokic on/off from BBRef...")
    on_off_data = {}

    for year in SEASONS:
        season_label = SEASON_LABELS[year]
        url = f"{BASE_URL}/players/j/jokicni01/on-off/{year}/"
        print(f"  Season {season_label}...")
        try:
            soup = get_soup(url)
            table = soup.find("table", {"id": "on-off"})
            if not table:
                print("    No on-off table found")
                delay()
                continue

            df = pd.read_html(StringIO(str(table)))[0]
            # Flatten multi-index columns
            df.columns = ["_".join(str(c) for c in col).strip("_") for col in df.columns]

            # Find the On Court and Off Court rows
            on_row = None
            off_row = None
            for _, row in df.iterrows():
                split_val = str(row.get("Unnamed: 0_level_0_Split", ""))
                if "On Court" in split_val:
                    on_row = row
                elif "Off Court" in split_val:
                    off_row = row

            def make_on_off_entry(row, court_status):
                if row is None:
                    return None
                mp = safe_float(row.get("Unnamed: 2_level_0_MP", 0))
                team_ortg = safe_float(row.get("Team_ORtg", 0))
                opp_ortg = safe_float(row.get("Opponent_ORtg", 0))
                return {
                    "VS_PLAYER_ID": 203999,
                    "VS_PLAYER_NAME": "Nikola Jokic",
                    "COURT_STATUS": court_status,
                    "GP": 0, "W": 0, "L": 0, "W_PCT": 0,
                    "MIN": mp,
                    # BBRef on-off is team-level, no individual box-score stats
                    "FGM": 0, "FGA": 0,
                    "FG_PCT": safe_float(row.get("Team_eFG%", 0)),
                    "FG3M": 0, "FG3A": 0, "FG3_PCT": 0,
                    "FTM": 0, "FTA": 0, "FT_PCT": 0,
                    "OREB": 0, "DREB": 0, "REB": 0,
                    "AST": 0, "TOV": 0, "STL": 0, "BLK": 0, "PF": 0,
                    "PTS": 0,
                    "PLUS_MINUS": round(team_ortg - opp_ortg, 1),
                }

            def make_advanced_entry(row, court_status):
                if row is None:
                    return None
                team_ortg = safe_float(row.get("Team_ORtg", 0))
                opp_ortg = safe_float(row.get("Opponent_ORtg", 0))
                return {
                    "VS_PLAYER_ID": 203999,
                    "VS_PLAYER_NAME": "Nikola Jokic",
                    "COURT_STATUS": court_status,
                    "OFF_RATING": team_ortg,
                    "DEF_RATING": opp_ortg,
                    "NET_RATING": round(team_ortg - opp_ortg, 1),
                    "EFG_PCT": safe_float(row.get("Team_eFG%", 0)),
                    "TS_PCT": 0,
                    "PACE": 0,
                    "AST_PCT": safe_float(row.get("Team_AST%", 0)),
                    "OREB_PCT": safe_float(row.get("Team_ORB%", 0)),
                    "DREB_PCT": safe_float(row.get("Team_DRB%", 0)),
                    "REB_PCT": safe_float(row.get("Team_TRB%", 0)),
                }

            on_base = make_on_off_entry(on_row, "On")
            off_base = make_on_off_entry(off_row, "Off")
            on_adv = make_advanced_entry(on_row, "On")
            off_adv = make_advanced_entry(off_row, "Off")

            if on_base or off_base:
                on_off_data[season_label] = {
                    "base": {
                        "jokic_on": on_base,
                        "jokic_off": off_base,
                    },
                    "advanced": {
                        "jokic_on": on_adv,
                        "jokic_off": off_adv,
                    },
                }
                on_ortg = safe_float(on_row.get("Team_ORtg", 0)) if on_row is not None else 0
                off_ortg = safe_float(off_row.get("Team_ORtg", 0)) if off_row is not None else 0
                print(f"    Team ORtg: On={on_ortg}, Off={off_ortg}")
        except Exception as e:
            print(f"    Warning: {e}")
            import traceback
            traceback.print_exc()
        delay()

    write_json("on_off_jokic.json", {"on_off": on_off_data, "lineup_pairs": {}})


def main():
    print("BraunStats — Basketball Reference Scraper")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 50)

    steps = [
        ("Player Overview", fetch_player_overview),
        ("Game Logs", fetch_game_logs),
        ("Career", fetch_career),
        ("General Splits", fetch_general_splits),
        ("Shooting Splits", fetch_shooting_splits),
        ("Jokic On/Off", fetch_on_off_jokic),
    ]
    succeeded = 0
    for name, fn in steps:
        try:
            fn()
            succeeded += 1
        except Exception as e:
            print(f"  FAILED {name}: {e}")
            import traceback
            traceback.print_exc()
            print("  Skipping...")

    print("=" * 50)
    print(f"Done! {succeeded}/{len(steps)} steps completed.")


if __name__ == "__main__":
    main()
