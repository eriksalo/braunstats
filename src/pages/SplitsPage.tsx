import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAppContext } from '../hooks/useAppContext'
import { CHART } from '../utils/colors'
import { generalSplits } from '../data'

export function SplitsPage() {
  const { season } = useAppContext()
  const data = generalSplits[season]

  if (!data) {
    return <p className="text-gray-400">No split data available for {season}.</p>
  }

  const locationData = data.location.map(l => ({
    name: l.GROUP_VALUE,
    PTS: l.PTS,
    REB: l.REB,
    AST: l.AST,
  }))

  const wlData = (data.win_loss ?? []).map(w => ({
    name: w.GROUP_VALUE,
    PTS: w.PTS,
    REB: w.REB,
    AST: w.AST,
  }))

  const allRows = [...data.location, ...(data.win_loss ?? []), ...(data.starter_bench ?? [])]

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-lg font-bold text-navy">Splits</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Home vs Away</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="PTS" fill={CHART.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="REB" fill={CHART.secondary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="AST" fill={CHART.line3} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {wlData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Wins vs Losses</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={wlData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="PTS" fill={CHART.positive} radius={[4, 4, 0, 0]} />
                <Bar dataKey="REB" fill={CHART.secondary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="AST" fill={CHART.line3} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">All Splits</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Split</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">GP</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">PTS</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">REB</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">AST</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">FG%</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">3P%</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">+/-</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{row.GROUP_VALUE}</td>
                  <td className="px-3 py-2 text-right">{row.GP}</td>
                  <td className="px-3 py-2 text-right">{row.PTS?.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{row.REB?.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{row.AST?.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{(row.FG_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{(row.FG3_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{row.PLUS_MINUS > 0 ? '+' : ''}{row.PLUS_MINUS?.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
