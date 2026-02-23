import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAppContext } from '../hooks/useAppContext'
import { CHART } from '../utils/colors'
import { shootingSplits } from '../data'
import { ShotChart } from '../components/Splits/ShotChart'

export function ShootingPage() {
  const { season } = useAppContext()
  const data = shootingSplits[season]

  if (!data) {
    return <p className="text-gray-400">No shooting data available for {season}.</p>
  }

  const areaData = data.shot_area.map(s => ({
    name: s.GROUP_VALUE,
    fgPct: +((s.FG_PCT ?? 0) * 100).toFixed(1),
    fgm: s.FGM,
    fga: s.FGA ?? 0,
  }))

  const typeData = data.shot_type.map(s => ({
    name: s.GROUP_VALUE,
    fgPct: +((s.FG_PCT ?? 0) * 100).toFixed(1),
    fgm: s.FGM,
    fga: s.FGA ?? 0,
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-lg font-bold text-navy">Shooting Splits</h2>

      <ShotChart areas={data.shot_area} />

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">FG% by Shot Area</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={areaData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis type="number" domain={[0, 80]} tick={{ fontSize: 11 }} unit="%" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
            <Tooltip />
            <Bar dataKey="fgPct" name="FG%" radius={[0, 4, 4, 0]}>
              {areaData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fgPct >= 50 ? CHART.positive : entry.fgPct >= 40 ? CHART.jokicOn : CHART.primary} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">FG% by Shot Type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={typeData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis type="number" domain={[0, 80]} tick={{ fontSize: 11 }} unit="%" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
            <Tooltip />
            <Bar dataKey="fgPct" name="FG%" fill={CHART.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Volume by Area</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Zone</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">FGM</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">FGA</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">FG%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.shot_area.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{s.GROUP_VALUE}</td>
                  <td className="px-3 py-2 text-right">{s.FGM.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{(s.FGA ?? 0).toFixed(1)}</td>
                  <td className="px-3 py-2 text-right font-medium">{((s.FG_PCT ?? 0) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
