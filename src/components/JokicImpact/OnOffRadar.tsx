import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { CHART } from '../../utils/colors'
import type { OnOffAdvancedStats } from '../../types'

interface OnOffRadarProps {
  on: OnOffAdvancedStats
  off: OnOffAdvancedStats
}

export function OnOffRadar({ on, off }: OnOffRadarProps) {
  const data = [
    { stat: 'OFF RTG', on: on.OFF_RATING, off: off.OFF_RATING },
    { stat: 'DEF RTG', on: 130 - on.DEF_RATING, off: 130 - off.DEF_RATING },
    { stat: 'NET RTG', on: on.NET_RATING + 20, off: off.NET_RATING + 20 },
    { stat: 'eFG%', on: on.EFG_PCT * 100, off: off.EFG_PCT * 100 },
    { stat: 'AST%', on: on.AST_PCT, off: off.AST_PCT },
    { stat: 'REB%', on: on.REB_PCT, off: off.REB_PCT },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Advanced: Jokic On vs Off</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fontSize: 10 }} />
          <Radar name="Jokic On" dataKey="on" stroke={CHART.jokicOn} fill={CHART.jokicOn} fillOpacity={0.3} />
          <Radar name="Jokic Off" dataKey="off" stroke={CHART.jokicOff} fill={CHART.jokicOff} fillOpacity={0.3} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-2 text-center">
        DEF RTG inverted (higher = better). NET RTG shifted +20. All stats are team-level.
      </p>
    </div>
  )
}
