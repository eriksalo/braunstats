# BraunStats

A stats explorer for **Christian Braun** on the Denver Nuggets, with a primary focus on his performance when Nikola Jokic is on vs. off the court.

Built with React + TypeScript + Tailwind CSS + Recharts. Hosted on AWS Amplify.

---

## Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Player bio, headshot, season averages (PPG, RPG, APG, FG%, 3P%, +/-) |
| **Jokic Impact** | On/off delta cards, grouped bar chart, radar chart, Braun+Jokic lineup pair stats |
| **Game Log** | Sortable & filterable table — filter by opponent, W/L; color-coded cells |
| **Shooting** | SVG court shot chart by zone, FG% bar charts by area and shot type |
| **Trends** | Monthly line charts for scoring, rebounding, assists, and FG% area chart |
| **Splits** | Home/Away and Win/Loss bar charts with detail table |
| **Career** | Year-over-year progression — counting stats, shooting efficiency, advanced metrics |
| **Advanced** | TS%, eFG%, USG%, PIE, offensive/defensive/net rating across seasons |

## Tech Stack

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS v4 + Recharts
- **Data**: Pre-compiled static JSON from Python `nba_api` script
- **Routing**: HashRouter (SPA-friendly for static hosting)
- **Hosting**: AWS Amplify with auto-deploy from `main`

## Project Structure

```
braunstats/
├── data/
│   ├── scripts/
│   │   ├── fetch_stats.py      # NBA API data pipeline
│   │   └── requirements.txt
│   ├── player_overview.json
│   ├── game_log.json
│   ├── on_off_jokic.json
│   ├── general_splits.json
│   ├── shooting_splits.json
│   └── career.json
├── src/
│   ├── components/
│   │   ├── Layout/             # Header, Sidebar, Footer
│   │   ├── Dashboard/          # StatCard, PlayerBio
│   │   ├── JokicImpact/        # DeltaCard, ImpactSummary, OnOffBarChart, OnOffRadar
│   │   └── Splits/             # ShotChart (SVG court)
│   ├── pages/                  # Route-level page components
│   ├── data/                   # Typed JSON imports
│   ├── hooks/                  # useAppContext, useSortableTable, useSeasonSelector
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # Formatters, color palette
├── amplify.yml
├── vite.config.ts
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

## Refreshing Data

The data pipeline fetches stats from the NBA API via `nba_api`:

```bash
pip install -r data/scripts/requirements.txt
python data/scripts/fetch_stats.py
```

This writes 6 JSON files to `data/`. Commit and push to trigger an Amplify redeploy.

> **Note:** `stats.nba.com` may block cloud/VPN IPs. Run from a residential connection with the script's built-in retry logic and 4-second delays between requests.

## Nuggets Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#0E2240` | Sidebar, headings |
| Gold | `#FEC524` | Highlights, Jokic On bars |
| Blue | `#1D428A` | Primary chart color, active nav |

---

Built with data from [stats.nba.com](https://stats.nba.com) via [nba_api](https://github.com/swar/nba_api).
