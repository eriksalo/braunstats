import { useState } from 'react'
import type { ShootingRow, ShotDetail } from '../../types'

interface ShotChartProps {
  areas: ShootingRow[]
  shots: ShotDetail[]
}

// NBA API coords: basket at (0,0), X: -250..250, Y: -50..400
// SVG coords: basket at (250, 380), we flip Y and scale
function toSvg(locX: number, locY: number): [number, number] {
  const x = 250 + locX * 0.9
  const y = 380 - locY * 0.85
  return [x, y]
}

function getZoneColor(pct: number | null): string {
  if (pct == null || pct === 0) return '#e2e8f0'
  const p = pct * 100
  if (p >= 50) return '#22c55e'
  if (p >= 45) return '#4ade80'
  if (p >= 40) return '#fbbf24'
  if (p >= 35) return '#fb923c'
  return '#ef4444'
}

function findZone(areas: ShootingRow[], name: string): ShootingRow | undefined {
  return areas.find(a => a.GROUP_VALUE === name)
}

function ZoneLabel({ x, y, zone }: { x: number; y: number; zone: ShootingRow | undefined }) {
  if (!zone) return null
  const pct = zone.FG_PCT != null ? (zone.FG_PCT * 100).toFixed(0) + '%' : '—'
  const vol = zone.FGA != null ? `${zone.FGM}/${zone.FGA}` : ''
  return (
    <g>
      <text x={x} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0E2240">{pct}</text>
      <text x={x} y={y + 8} textAnchor="middle" fontSize="9" fill="#64748b">{vol}</text>
    </g>
  )
}

function CourtLines() {
  return (
    <>
      {/* Half court outline */}
      <rect x="25" y="20" width="450" height="370" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Three-point arc */}
      <path
        d="M 67 390 L 67 185 Q 67 42 250 42 Q 433 42 433 185 L 433 390"
        fill="none" stroke="#94a3b8" strokeWidth="1.5"
      />

      {/* Paint / key */}
      <rect x="170" y="260" width="160" height="130" fill="none" stroke="#94a3b8" strokeWidth="1" />

      {/* Free throw circle */}
      <circle cx="250" cy="260" r="60" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />

      {/* Restricted area arc */}
      <path
        d="M 220 390 Q 220 340 250 340 Q 280 340 280 390"
        fill="none" stroke="#94a3b8" strokeWidth="1"
      />

      {/* Basket */}
      <circle cx="250" cy="380" r="7" fill="none" stroke="#0E2240" strokeWidth="2" />

      {/* Backboard */}
      <line x1="232" y1="392" x2="268" y2="392" stroke="#0E2240" strokeWidth="2.5" />
    </>
  )
}

function ZoneView({ areas }: { areas: ShootingRow[] }) {
  const ra = findZone(areas, 'Restricted Area')
  const paint = findZone(areas, 'In The Paint (Non-RA)')
  const mid = findZone(areas, 'Mid-Range')
  const lc3 = findZone(areas, 'Left Corner 3')
  const rc3 = findZone(areas, 'Right Corner 3')
  const atb3 = findZone(areas, 'Above the Break 3')

  return (
    <>
      {/* Three-point fill */}
      <path
        d="M 67 390 L 67 185 Q 67 42 250 42 Q 433 42 433 185 L 433 390 Z"
        fill={getZoneColor(atb3?.FG_PCT ?? null)} fillOpacity="0.35"
      />
      {/* Mid-range fill */}
      <path
        d="M 130 390 L 130 200 Q 130 100 250 100 Q 370 100 370 200 L 370 390 Z"
        fill={getZoneColor(mid?.FG_PCT ?? null)} fillOpacity="0.4"
      />
      {/* Paint fill */}
      <rect x="170" y="260" width="160" height="130" fill={getZoneColor(paint?.FG_PCT ?? null)} fillOpacity="0.45" />
      {/* Restricted fill */}
      <path
        d="M 215 390 Q 215 330 250 330 Q 285 330 285 390 Z"
        fill={getZoneColor(ra?.FG_PCT ?? null)} fillOpacity="0.55"
      />
      {/* Left corner 3 */}
      <rect x="25" y="310" width="42" height="80" fill={getZoneColor(lc3?.FG_PCT ?? null)} fillOpacity="0.45" rx="2" />
      {/* Right corner 3 */}
      <rect x="433" y="310" width="42" height="80" fill={getZoneColor(rc3?.FG_PCT ?? null)} fillOpacity="0.45" rx="2" />

      <CourtLines />

      {/* Zone labels */}
      <ZoneLabel x={250} y={360} zone={ra} />
      <ZoneLabel x={250} y={300} zone={paint} />
      <ZoneLabel x={250} y={185} zone={mid} />
      <ZoneLabel x={46} y={345} zone={lc3} />
      <ZoneLabel x={454} y={345} zone={rc3} />
      <ZoneLabel x={250} y={75} zone={atb3} />

      {/* Legend */}
      <g transform="translate(30, 5)">
        {[
          { color: '#ef4444', label: '<35%' },
          { color: '#fb923c', label: '35-39%' },
          { color: '#fbbf24', label: '40-44%' },
          { color: '#4ade80', label: '45-49%' },
          { color: '#22c55e', label: '50%+' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 88}, 0)`}>
            <rect width="10" height="10" fill={item.color} fillOpacity="0.5" rx="2" />
            <text x="14" y="9" fontSize="8" fill="#64748b">{item.label}</text>
          </g>
        ))}
      </g>
    </>
  )
}

function ScatterView({ shots }: { shots: ShotDetail[] }) {
  const made = shots.filter(s => s.SHOT_MADE_FLAG === 1)
  const missed = shots.filter(s => s.SHOT_MADE_FLAG === 0)
  const total = shots.length
  const madeCount = made.length
  const pct = total > 0 ? ((madeCount / total) * 100).toFixed(1) : '0'

  return (
    <>
      <CourtLines />

      {/* Missed shots (render first, behind makes) */}
      {missed.map((s, i) => {
        const [x, y] = toSvg(s.LOC_X, s.LOC_Y)
        return (
          <g key={`miss-${i}`} opacity="0.55">
            <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke="#ef4444" strokeWidth="1.5" />
            <line x1={x + 3} y1={y - 3} x2={x - 3} y2={y + 3} stroke="#ef4444" strokeWidth="1.5" />
          </g>
        )
      })}

      {/* Made shots */}
      {made.map((s, i) => {
        const [x, y] = toSvg(s.LOC_X, s.LOC_Y)
        return (
          <circle key={`make-${i}`} cx={x} cy={y} r="3.5" fill="#22c55e" fillOpacity="0.7" stroke="#16a34a" strokeWidth="0.5" />
        )
      })}

      {/* Legend */}
      <g transform="translate(30, 5)">
        <circle cx="6" cy="6" r="4" fill="#22c55e" fillOpacity="0.7" stroke="#16a34a" strokeWidth="0.5" />
        <text x="14" y="9" fontSize="9" fill="#64748b">Made ({madeCount})</text>
        <g transform="translate(100, 0)">
          <line x1="3" y1="3" x2="9" y2="9" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="9" y1="3" x2="3" y2="9" stroke="#ef4444" strokeWidth="1.5" />
          <text x="14" y="9" fontSize="9" fill="#64748b">Missed ({total - madeCount})</text>
        </g>
        <text x="250" y="9" fontSize="9" fill="#475569" fontWeight="600">{total} shots — {pct}% FG</text>
      </g>
    </>
  )
}

export function ShotChart({ areas, shots }: ShotChartProps) {
  const [view, setView] = useState<'scatter' | 'zones'>('scatter')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Shot Chart</h3>
        <div className="flex rounded-lg border border-gray-200 text-xs overflow-hidden">
          <button
            onClick={() => setView('scatter')}
            className={`px-3 py-1.5 transition-colors ${view === 'scatter' ? 'bg-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Shots
          </button>
          <button
            onClick={() => setView('zones')}
            className={`px-3 py-1.5 transition-colors ${view === 'zones' ? 'bg-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Zones
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <svg viewBox="0 0 500 410" className="max-w-xl w-full" style={{ background: '#f8fafc', borderRadius: 8 }}>
          {view === 'zones' ? <ZoneView areas={areas} /> : <ScatterView shots={shots} />}
        </svg>
      </div>
    </div>
  )
}
