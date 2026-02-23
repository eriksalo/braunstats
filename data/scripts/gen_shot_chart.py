import json
import random
import math

random.seed(42)

opponents = [
    "LAL", "GSW", "PHX", "LAC", "MIN", "OKC", "BOS", "MIL", "NYK", "PHI",
    "MIA", "SAC", "DAL", "HOU", "SAS", "POR", "UTA", "CLE", "ATL", "CHI",
    "DET", "IND", "TOR", "CHA", "WAS", "ORL", "BKN", "MEM", "NOP"
]

action_types_by_zone = {
    "Restricted Area": [
        ("Driving Layup Shot", 30), ("Layup Shot", 20), ("Cutting Layup Shot", 15),
        ("Dunk Shot", 12), ("Driving Dunk Shot", 8), ("Reverse Layup Shot", 8),
        ("Finger Roll Layup Shot", 4), ("Putback Layup Shot", 3)
    ],
    "In The Paint (Non-RA)": [
        ("Floating Jump Shot", 30), ("Driving Floating Jump Shot", 20),
        ("Jump Shot", 15), ("Turnaround Jump Shot", 10),
        ("Hook Shot", 8), ("Driving Layup Shot", 10), ("Runner", 7)
    ],
    "Mid-Range": [
        ("Jump Shot", 30), ("Pullup Jump Shot", 20), ("Step Back Jump Shot", 10),
        ("Turnaround Jump Shot", 12), ("Fadeaway Jump Shot", 8),
        ("Driving Floating Jump Shot", 10), ("Floating Jump Shot", 10)
    ],
    "Left Corner 3": [
        ("Jump Shot", 55), ("Pullup Jump Shot", 15), ("Step Back Jump Shot", 15),
        ("Catch and Shoot Jump Shot", 15)
    ],
    "Right Corner 3": [
        ("Jump Shot", 55), ("Pullup Jump Shot", 15), ("Step Back Jump Shot", 15),
        ("Catch and Shoot Jump Shot", 15)
    ],
    "Above the Break 3": [
        ("Jump Shot", 35), ("Pullup Jump Shot", 25), ("Step Back Jump Shot", 15),
        ("Catch and Shoot Jump Shot", 15), ("Driving Floating Bank Jump Shot", 5),
        ("Turnaround Jump Shot", 5)
    ]
}


def weighted_choice(options):
    items, weights = zip(*options)
    return random.choices(items, weights=weights, k=1)[0]


def gen_zone_area(loc_x, zone):
    if zone == "Left Corner 3":
        return "Left Side(L)"
    if zone == "Right Corner 3":
        return "Right Side(R)"
    if abs(loc_x) <= 60:
        return "Center(C)"
    elif loc_x < -60:
        if abs(loc_x) > 150:
            return "Left Side(L)"
        return "Left Side Center(LC)"
    else:
        if abs(loc_x) > 150:
            return "Right Side(R)"
        return "Right Side Center(RC)"


def shot_distance(loc_x, loc_y):
    return round(math.sqrt(loc_x**2 + loc_y**2) / 10.0)


def gen_game_dates_ids(season_str, num_games, start_game_id_offset):
    if season_str == "2024-25":
        months = [
            (2024, 10, 22, 31),
            (2024, 11, 1, 30),
            (2024, 12, 1, 31),
            (2025, 1, 1, 31),
            (2025, 2, 1, 22),
        ]
    elif season_str == "2023-24":
        months = [
            (2023, 10, 24, 31),
            (2023, 11, 1, 30),
            (2023, 12, 1, 31),
            (2024, 1, 1, 31),
            (2024, 2, 1, 29),
            (2024, 3, 1, 31),
            (2024, 4, 1, 14),
        ]
    else:
        months = [
            (2022, 10, 19, 31),
            (2022, 11, 1, 30),
            (2022, 12, 1, 31),
            (2023, 1, 1, 31),
            (2023, 2, 1, 28),
            (2023, 3, 1, 31),
            (2023, 4, 1, 9),
        ]

    all_dates = []
    for y, m, d_start, d_end in months:
        for d in range(d_start, d_end + 1):
            all_dates.append(f"{y:04d}{m:02d}{d:02d}")

    chosen = sorted(random.sample(all_dates, min(num_games, len(all_dates))))
    games = []
    for i, dt in enumerate(chosen):
        gid = f"002{season_str[:4][1:]}0{start_game_id_offset + i:04d}"
        opp = random.choice(opponents)
        matchup = f"DEN vs. {opp}" if random.random() < 0.5 else f"DEN @ {opp}"
        games.append((gid, dt, matchup))
    return games


def generate_shots_for_zone(zone, count, make_pct, season, games):
    shots = []
    for _ in range(count):
        game = random.choice(games)
        game_id, game_date, matchup = game

        if zone == "Restricted Area":
            loc_x = random.randint(-30, 30)
            loc_y = random.randint(-10, 40)
            loc_x = int(loc_x + random.gauss(0, 8))
            loc_y = int(loc_y + random.gauss(0, 6))
            loc_x = max(-40, min(40, loc_x))
            loc_y = max(-10, min(50, loc_y))
            shot_type = "2PT Field Goal"
        elif zone == "In The Paint (Non-RA)":
            loc_x = random.randint(-80, 80)
            loc_y = random.randint(40, 140)
            loc_x = int(loc_x + random.gauss(0, 12))
            loc_y = int(loc_y + random.gauss(0, 15))
            loc_x = max(-90, min(90, loc_x))
            loc_y = max(35, min(150, loc_y))
            shot_type = "2PT Field Goal"
        elif zone == "Mid-Range":
            loc_x = random.randint(-160, 160)
            loc_y = random.randint(50, 200)
            loc_x = int(loc_x + random.gauss(0, 20))
            loc_y = int(loc_y + random.gauss(0, 15))
            loc_x = max(-175, min(175, loc_x))
            loc_y = max(40, min(210, loc_y))
            shot_type = "2PT Field Goal"
        elif zone == "Left Corner 3":
            loc_x = random.randint(-230, -210)
            loc_y = random.randint(-10, 40)
            loc_x = int(loc_x + random.gauss(0, 5))
            loc_y = int(loc_y + random.gauss(0, 8))
            loc_x = max(-245, min(-200, loc_x))
            loc_y = max(-15, min(50, loc_y))
            shot_type = "3PT Field Goal"
        elif zone == "Right Corner 3":
            loc_x = random.randint(210, 230)
            loc_y = random.randint(-10, 40)
            loc_x = int(loc_x + random.gauss(0, 5))
            loc_y = int(loc_y + random.gauss(0, 8))
            loc_x = max(200, min(245, loc_x))
            loc_y = max(-15, min(50, loc_y))
            shot_type = "3PT Field Goal"
        elif zone == "Above the Break 3":
            angle = random.uniform(0.15, math.pi - 0.15)
            radius = 237.5 + random.gauss(0, 15)
            radius = max(220, min(280, radius))
            base_x = radius * math.cos(angle)
            loc_x = int(base_x if random.random() < 0.5 else -base_x)
            loc_y = int(abs(radius * math.sin(angle)))
            loc_y = max(90, min(310, loc_y))
            loc_x = max(-240, min(240, loc_x))
            shot_type = "3PT Field Goal"

        made = 1 if random.random() < make_pct else 0
        dist = shot_distance(loc_x, loc_y)
        action = weighted_choice(action_types_by_zone[zone])
        area = gen_zone_area(loc_x, zone)

        shots.append({
            "SEASON": season,
            "GAME_ID": game_id,
            "GAME_DATE": game_date,
            "LOC_X": loc_x,
            "LOC_Y": loc_y,
            "SHOT_MADE_FLAG": made,
            "SHOT_TYPE": shot_type,
            "SHOT_ZONE_BASIC": zone,
            "SHOT_ZONE_AREA": area,
            "SHOT_DISTANCE": dist,
            "ACTION_TYPE": action,
            "MATCHUP": matchup
        })
    return shots


# ---- 2024-25 Season: ~665 shots across ~55 games ----
games_2425 = gen_game_dates_ids("2024-25", 55, 100)
all_shots = []

all_shots += generate_shots_for_zone("Restricted Area", 175, 0.72, "2024-25", games_2425)
all_shots += generate_shots_for_zone("In The Paint (Non-RA)", 100, 0.44, "2024-25", games_2425)
all_shots += generate_shots_for_zone("Mid-Range", 120, 0.41, "2024-25", games_2425)
all_shots += generate_shots_for_zone("Left Corner 3", 55, 0.40, "2024-25", games_2425)
all_shots += generate_shots_for_zone("Right Corner 3", 60, 0.45, "2024-25", games_2425)
all_shots += generate_shots_for_zone("Above the Break 3", 155, 0.32, "2024-25", games_2425)

# ---- 2023-24 Season: ~100 shots, more restricted area, less 3s ----
games_2324 = gen_game_dates_ids("2023-24", 65, 200)

all_shots += generate_shots_for_zone("Restricted Area", 40, 0.68, "2023-24", games_2324)
all_shots += generate_shots_for_zone("In The Paint (Non-RA)", 20, 0.40, "2023-24", games_2324)
all_shots += generate_shots_for_zone("Mid-Range", 15, 0.38, "2023-24", games_2324)
all_shots += generate_shots_for_zone("Left Corner 3", 8, 0.35, "2023-24", games_2324)
all_shots += generate_shots_for_zone("Right Corner 3", 7, 0.36, "2023-24", games_2324)
all_shots += generate_shots_for_zone("Above the Break 3", 10, 0.28, "2023-24", games_2324)

# ---- 2022-23 Season: ~50 shots, mostly paint ----
games_2223 = gen_game_dates_ids("2022-23", 50, 300)

all_shots += generate_shots_for_zone("Restricted Area", 25, 0.70, "2022-23", games_2223)
all_shots += generate_shots_for_zone("In The Paint (Non-RA)", 10, 0.42, "2022-23", games_2223)
all_shots += generate_shots_for_zone("Mid-Range", 7, 0.36, "2022-23", games_2223)
all_shots += generate_shots_for_zone("Left Corner 3", 3, 0.33, "2022-23", games_2223)
all_shots += generate_shots_for_zone("Right Corner 3", 2, 0.33, "2022-23", games_2223)
all_shots += generate_shots_for_zone("Above the Break 3", 3, 0.25, "2022-23", games_2223)

# Shuffle then sort by date for chronological order
random.shuffle(all_shots)
all_shots.sort(key=lambda s: s["GAME_DATE"])

result = {
    "meta": {
        "generated_at": "2026-02-22T12:00:00Z",
        "season": None
    },
    "data": {
        "shots": all_shots
    }
}

output = json.dumps(result, indent=2)
print(output)
