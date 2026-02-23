import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CHART } from '../utils/colors'
import { career } from '../data'

export function AdvancedPage() {
  if (!career.advanced?.length) {
    return <p className="text-gray-400">No advanced data available.</p>
  }

  const advData = career.advanced.map(s => ({
    season: s.GROUP_VALUE,
    'TS%': +(s.TS_PCT * 100).toFixed(1),
    'eFG%': +(s.EFG_PCT * 100).toFixed(1),
    'USG%': +(s.USG_PCT * 100).toFixed(1),
    OFF_RTG: s.OFF_RATING,
    DEF_RTG: s.DEF_RATING,
    NET_RTG: s.NET_RATING,
    PACE: s.PACE,
    PIE: +(s.PIE * 100).toFixed(1),
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-lg font-bold text-navy">Advanced Stats</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Efficiency Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={advData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="season" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[10, 65]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="TS%" stroke={CHART.line1} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="eFG%" stroke={CHART.line2} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="USG%" stroke={CHART.line4} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="PIE" stroke={CHART.line3} strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Ratings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={advData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="season" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="OFF_RTG" stroke={CHART.positive} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="DEF_RTG" stroke={CHART.negative} strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="NET_RTG" stroke={CHART.primary} strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Advanced Stats Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Season', 'OFF RTG', 'DEF RTG', 'NET RTG', 'TS%', 'eFG%', 'USG%', 'PACE', 'PIE'].map(h => (
                  <th key={h} className="px-3 py-2 text-right text-xs font-medium text-gray-500 first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {career.advanced.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{s.GROUP_VALUE}</td>
                  <td className="px-3 py-2 text-right">{s.OFF_RATING.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{s.DEF_RATING.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right font-semibold">{s.NET_RATING > 0 ? '+' : ''}{s.NET_RATING.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{(s.TS_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{(s.EFG_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{(s.USG_PCT * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right">{s.PACE.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{(s.PIE * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
