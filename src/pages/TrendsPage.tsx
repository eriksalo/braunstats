import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useAppContext } from '../hooks/useAppContext'
import { CHART } from '../utils/colors'
import { generalSplits } from '../data'

export function TrendsPage() {
  const { season } = useAppContext()
  const data = generalSplits[season]
  const months = data?.month ?? []

  if (!months.length) {
    return <p className="text-gray-400">No monthly data available for {season}.</p>
  }

  const chartData = months.map(m => ({
    name: m.GROUP_VALUE,
    PTS: m.PTS,
    REB: m.REB,
    AST: m.AST,
    'FG%': +(m.FG_PCT * 100).toFixed(1),
    GP: m.GP,
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-lg font-bold text-navy">Monthly Trends</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Scoring & Playmaking</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="PTS" stroke={CHART.line1} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="REB" stroke={CHART.line2} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="AST" stroke={CHART.line3} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Shooting Efficiency</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[30, 60]} unit="%" />
            <Tooltip />
            <Area type="monotone" dataKey="FG%" stroke={CHART.line1} fill={CHART.line1} fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
