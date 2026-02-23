import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART } from '../../utils/colors'
import type { OnOffAdvancedStats } from '../../types'

interface OnOffBarChartProps {
  on: OnOffAdvancedStats
  off: OnOffAdvancedStats
}

export function OnOffBarChart({ on, off }: OnOffBarChartProps) {
  const stats = [
    { name: 'ORtg', on: on.OFF_RATING, off: off.OFF_RATING },
    { name: 'DRtg', on: on.DEF_RATING, off: off.DEF_RATING },
    { name: 'Net', on: on.NET_RATING, off: off.NET_RATING },
    { name: 'eFG%', on: +(on.EFG_PCT * 100).toFixed(1), off: +(off.EFG_PCT * 100).toFixed(1) },
    { name: 'AST%', on: on.AST_PCT, off: off.AST_PCT },
    { name: 'REB%', on: on.REB_PCT, off: off.REB_PCT },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Team Ratings: Jokic On vs Off Court</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={stats} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="on" name="Jokic On" fill={CHART.jokicOn} radius={[4, 4, 0, 0]} />
          <Bar dataKey="off" name="Jokic Off" fill={CHART.jokicOff} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
