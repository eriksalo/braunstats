import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { CHART } from '../utils/colors'
import { career } from '../data'

export function CareerPage() {
  if (!career.base?.length) {
    return <p className="text-gray-400">No career data available.</p>
  }

  const baseData = career.base.map(s => ({
    season: s.GROUP_VALUE,
    PTS: s.PTS,
    REB: s.REB,
    AST: s.AST,
    GP: s.GP,
    MIN: s.MIN,
    'FG%': +(s.FG_PCT * 100).toFixed(1),
    '3P%': +(s.FG3_PCT * 100).toFixed(1),
    'FT%': +(s.FT_PCT * 100).toFixed(1),
    '+/-': s.PLUS_MINUS,
    STL: s.STL,
    BLK: s.BLK,
  }))

  const advData = career.advanced?.map(s => ({
    season: s.GROUP_VALUE,
    'TS%': +(s.TS_PCT * 100).toFixed(1),
    'eFG%': +(s.EFG_PCT * 100).toFixed(1),
    'USG%': +(s.USG_PCT * 100).toFixed(1),
    NET: s.NET_RATING,
    PACE: s.PACE,
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-lg font-bold text-navy">Career Progression</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Counting Stats by Season</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={baseData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="season" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="PTS" fill={CHART.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="REB" fill={CHART.secondary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="AST" fill={CHART.line3} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Shooting Efficiency by Season</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={baseData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="season" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[30, 90]} unit="%" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="FG%" stroke={CHART.line1} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="3P%" stroke={CHART.line2} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="FT%" stroke={CHART.line3} strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {advData && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Advanced Efficiency</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={advData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="season" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="TS%" stroke={CHART.line1} strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="eFG%" stroke={CHART.line2} strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="USG%" stroke={CHART.line4} strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Season-by-Season</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Season', 'GP', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG%', '3P%', 'FT%', '+/-'].map(h => (
                  <th key={h} className="px-3 py-2 text-right text-xs font-medium text-gray-500 first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {career.base.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{s.GROUP_VALUE}</td>
                  <td className="px-3 py-2 text-right">{s.GP}</td>
                  <td className="px-3 py-2 text-right">{s.MIN.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right font-semibold">{s.PTS.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{s.REB.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{s.AST.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{s.STL.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{s.BLK.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{(s.FG_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{(s.FG3_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{(s.FT_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{s.PLUS_MINUS > 0 ? '+' : ''}{s.PLUS_MINUS.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
