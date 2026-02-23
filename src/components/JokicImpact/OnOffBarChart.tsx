import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART } from '../../utils/colors'
import type { OnOffBaseStats } from '../../types'

interface OnOffBarChartProps {
  on: OnOffBaseStats
  off: OnOffBaseStats
}

export function OnOffBarChart({ on, off }: OnOffBarChartProps) {
  const stats = [
    { name: 'PTS', on: on.PTS, off: off.PTS },
    { name: 'REB', on: on.REB, off: off.REB },
    { name: 'AST', on: on.AST, off: off.AST },
    { name: 'FG%', on: +(on.FG_PCT * 100).toFixed(1), off: +(off.FG_PCT * 100).toFixed(1) },
    { name: '3P%', on: +(on.FG3_PCT * 100).toFixed(1), off: +(off.FG3_PCT * 100).toFixed(1) },
    { name: '+/-', on: on.PLUS_MINUS, off: off.PLUS_MINUS },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Team Stats: Jokic On vs Off Court</h3>
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
