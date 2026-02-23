import type {
  PlayerOverviewData,
  GameLogData,
  OnOffJokicData,
  GeneralSplitsData,
  ShootingSplitsData,
  CareerData,
  ShotChartData,
} from '../types'

import playerOverviewJson from '../../data/player_overview.json'
import gameLogJson from '../../data/game_log.json'
import onOffJson from '../../data/on_off_jokic.json'
import generalSplitsJson from '../../data/general_splits.json'
import shootingSplitsJson from '../../data/shooting_splits.json'
import careerJson from '../../data/career.json'
import shotChartJson from '../../data/shot_chart.json'

export const meta = playerOverviewJson.meta

export const playerOverview = playerOverviewJson.data as unknown as PlayerOverviewData
export const gameLog = gameLogJson.data as unknown as GameLogData
export const onOffJokic = onOffJson.data as unknown as OnOffJokicData
export const generalSplits = generalSplitsJson.data as unknown as GeneralSplitsData
export const shootingSplits = shootingSplitsJson.data as unknown as ShootingSplitsData
export const career = careerJson.data as unknown as CareerData
export const shotChart = shotChartJson.data as unknown as ShotChartData
