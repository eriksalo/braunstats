export interface JsonWrapper<T> {
  meta: {
    generated_at: string
    season: string | null
  }
  data: T
}

// player_overview.json
export interface PlayerInfo {
  PERSON_ID: number
  FIRST_NAME: string
  LAST_NAME: string
  DISPLAY_FIRST_LAST: string
  BIRTHDATE: string
  SCHOOL: string
  COUNTRY: string
  HEIGHT: string
  WEIGHT: string
  JERSEY: string
  POSITION: string
  TEAM_ID: number
  TEAM_NAME: string
  TEAM_ABBREVIATION: string
  TEAM_CITY: string
  FROM_YEAR: number
  TO_YEAR: number
  DRAFT_YEAR: string
  DRAFT_ROUND: string
  DRAFT_NUMBER: string
  ROSTERSTATUS: string
  SEASON_EXP: number
}

export interface PlayerHeadline {
  PTS: number
  AST: number
  REB: number
  PIE: number
  ALL_STAR_APPEARANCES: number
}

export interface PlayerOverviewData {
  info: PlayerInfo
  headline: PlayerHeadline
}

// game_log.json
export interface GameLogEntry {
  SEASON: string
  SEASON_TYPE: string
  SEASON_ID: string
  Player_ID: number
  Game_ID: string
  GAME_DATE: string
  MATCHUP: string
  WL: string
  MIN: number
  FGM: number
  FGA: number
  FG_PCT: number
  FG3M: number
  FG3A: number
  FG3_PCT: number
  FTM: number
  FTA: number
  FT_PCT: number
  OREB: number
  DREB: number
  REB: number
  AST: number
  STL: number
  BLK: number
  TOV: number
  PF: number
  PTS: number
  PLUS_MINUS: number
  VIDEO_AVAILABLE: number
}

export interface GameLogData {
  games: GameLogEntry[]
}

// on_off_jokic.json
export interface OnOffBaseStats {
  VS_PLAYER_ID: number
  VS_PLAYER_NAME: string
  COURT_STATUS: string
  GP: number
  W: number
  L: number
  W_PCT: number
  MIN: number
  FGM: number
  FGA: number
  FG_PCT: number
  FG3M: number
  FG3A: number
  FG3_PCT: number
  FTM: number
  FTA: number
  FT_PCT: number
  OREB: number
  DREB: number
  REB: number
  AST: number
  TOV: number
  STL: number
  BLK: number
  PF: number
  PTS: number
  PLUS_MINUS: number
}

export interface OnOffAdvancedStats {
  VS_PLAYER_ID: number
  VS_PLAYER_NAME: string
  COURT_STATUS: string
  GP: number
  W: number
  L: number
  MIN: number
  OFF_RATING: number
  DEF_RATING: number
  NET_RATING: number
  AST_PCT: number
  AST_TO: number
  AST_RATIO: number
  OREB_PCT: number
  DREB_PCT: number
  REB_PCT: number
  EFG_PCT: number
  TS_PCT: number
  USG_PCT: number
  PACE: number
  PIE: number
}

export interface LineupPairStats {
  GROUP_SET: string
  GROUP_ID: string
  GP: number
  W: number
  L: number
  W_PCT: number
  MIN: number
  FGM: number
  FGA: number
  FG_PCT: number
  FG3M: number
  FG3A: number
  FG3_PCT: number
  FTM: number
  FTA: number
  FT_PCT: number
  REB: number
  AST: number
  TOV: number
  STL: number
  BLK: number
  PTS: number
  PLUS_MINUS: number
  NET_RATING?: number
}

export interface SeasonOnOff {
  base?: {
    jokic_on: OnOffBaseStats | null
    jokic_off: OnOffBaseStats | null
  }
  advanced?: {
    jokic_on: OnOffAdvancedStats | null
    jokic_off: OnOffAdvancedStats | null
  }
}

export interface OnOffJokicData {
  on_off: Record<string, SeasonOnOff | null>
  lineup_pairs: Record<string, LineupPairStats | null>
}

// general_splits.json
export interface SplitRow {
  GROUP_SET: string
  GROUP_VALUE: string
  GP: number
  W: number
  L: number
  W_PCT: number
  MIN: number
  FGM: number
  FGA: number
  FG_PCT: number
  FG3M: number
  FG3A: number
  FG3_PCT: number
  FTM: number
  FTA: number
  FT_PCT: number
  OREB: number
  DREB: number
  REB: number
  AST: number
  TOV: number
  STL: number
  BLK: number
  PF: number
  PTS: number
  PLUS_MINUS: number
}

export interface SeasonSplits {
  overall: SplitRow[]
  location: SplitRow[]
  win_loss?: SplitRow[]
  month?: SplitRow[]
  pre_post_allstar?: SplitRow[]
  starter_bench?: SplitRow[]
  days_rest?: SplitRow[]
}

export type GeneralSplitsData = Record<string, SeasonSplits>

// shooting_splits.json
export interface ShootingRow {
  GROUP_SET?: string
  GROUP_VALUE: string
  FGM: number
  FGA: number | null
  FG_PCT: number | null
  FG3M?: number
  FG3A?: number
  FG3_PCT?: number
  EFG_PCT?: number
  PCT_FGM?: number
  PCT_AST_FGM?: number
  PCT_UAST_FGM?: number
}

export interface SeasonShooting {
  shot_type: ShootingRow[]
  shot_area: ShootingRow[]
  distance: ShootingRow[]
  assisted: ShootingRow[]
}

export type ShootingSplitsData = Record<string, SeasonShooting>

// career.json
export interface CareerBaseRow {
  GROUP_VALUE: string
  GP: number
  W?: number
  L?: number
  MIN: number
  FGM: number
  FGA: number
  FG_PCT: number
  FG3M: number
  FG3A: number
  FG3_PCT: number
  FTM: number
  FTA: number
  FT_PCT: number
  OREB: number
  DREB: number
  REB: number
  AST: number
  TOV: number
  STL: number
  BLK: number
  PF?: number
  PTS: number
  PLUS_MINUS: number
}

export interface CareerAdvancedRow {
  GROUP_VALUE: string
  GP: number
  MIN: number
  OFF_RATING: number
  DEF_RATING: number
  NET_RATING: number
  TS_PCT: number
  EFG_PCT: number
  USG_PCT: number
  PACE: number
  PIE: number
  AST_PCT?: number
  AST_TO?: number
  REB_PCT?: number
  OREB_PCT?: number
  DREB_PCT?: number
}

export interface CareerData {
  base: CareerBaseRow[]
  advanced: CareerAdvancedRow[]
}

// shot_chart.json
export interface ShotDetail {
  SEASON: string
  GAME_ID: string
  GAME_DATE: string
  LOC_X: number
  LOC_Y: number
  SHOT_MADE_FLAG: number
  SHOT_TYPE: string
  SHOT_ZONE_BASIC: string
  SHOT_ZONE_AREA: string
  SHOT_DISTANCE: number
  ACTION_TYPE: string
  MATCHUP: string
}

export interface ShotChartData {
  shots: ShotDetail[]
}

export type Season = '2022-23' | '2023-24' | '2024-25' | '2025-26'

export const SEASONS: Season[] = ['2022-23', '2023-24', '2024-25', '2025-26']
export const DEFAULT_SEASON: Season = '2024-25'
