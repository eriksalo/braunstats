import type { ShootingRow } from '../../types'

interface ShotChartProps {
  areas: ShootingRow[]
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
      <text x={x} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0E2240">
        {pct}
      </text>
      <text x={x} y={y + 8} textAnchor="middle" fontSize="9" fill="#64748b">
        {vol}
      </text>
    </g>
  )
}

export function ShotChart({ areas }: ShotChartProps) {
  const ra = findZone(areas, 'Restricted Area')
  const paint = findZone(areas, 'In The Paint (Non-RA)')
  const mid = findZone(areas, 'Mid-Range')
  const lc3 = findZone(areas, 'Left Corner 3')
  const rc3 = findZone(areas, 'Right Corner 3')
  const atb3 = findZone(areas, 'Above the Break 3')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Shot Chart by Zone</h3>
      <div className="flex justify-center">
        <svg viewBox="0 0 500 400" className="max-w-lg w-full">
          {/* Court background */}
          <rect x="0" y="0" width="500" height="400" fill="#f8fafc" rx="8" />

          {/* Half court outline */}
          <rect x="50" y="30" width="400" height="350" fill="none" stroke="#cbd5e1" strokeWidth="2" rx="4" />

          {/* Three-point arc - above the break */}
          <path
            d="M 90 380 L 90 200 Q 90 60 250 60 Q 410 60 410 200 L 410 380"
            fill={getZoneColor(atb3?.FG_PCT ?? null)}
            fillOpacity="0.4"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Mid-range zone */}
          <path
            d="M 140 380 L 140 200 Q 140 110 250 110 Q 360 110 360 200 L 360 380 Z"
            fill={getZoneColor(mid?.FG_PCT ?? null)}
            fillOpacity="0.5"
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* Paint (non-restricted) */}
          <rect
            x="175" y="240" width="150" height="140"
            fill={getZoneColor(paint?.FG_PCT ?? null)}
            fillOpacity="0.5"
            stroke="#94a3b8"
            strokeWidth="1"
            rx="4"
          />

          {/* Restricted area - semicircle near basket */}
          <path
            d="M 210 380 Q 210 310 250 310 Q 290 310 290 380 Z"
            fill={getZoneColor(ra?.FG_PCT ?? null)}
            fillOpacity="0.6"
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* Basket / hoop */}
          <circle cx="250" cy="375" r="8" fill="none" stroke="#0E2240" strokeWidth="2" />
          <line x1="250" y1="383" x2="250" y2="390" stroke="#0E2240" strokeWidth="2" />

          {/* Backboard */}
          <line x1="230" y1="390" x2="270" y2="390" stroke="#0E2240" strokeWidth="3" />

          {/* Free throw line */}
          <line x1="175" y1="240" x2="325" y2="240" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />

          {/* Left corner 3 zone */}
          <rect
            x="50" y="300" width="40" height="80"
            fill={getZoneColor(lc3?.FG_PCT ?? null)}
            fillOpacity="0.5"
            stroke="#94a3b8"
            strokeWidth="1"
            rx="3"
          />

          {/* Right corner 3 zone */}
          <rect
            x="410" y="300" width="40" height="80"
            fill={getZoneColor(rc3?.FG_PCT ?? null)}
            fillOpacity="0.5"
            stroke="#94a3b8"
            strokeWidth="1"
            rx="3"
          />

          {/* Zone labels */}
          <ZoneLabel x={250} y={350} zone={ra} />
          <ZoneLabel x={250} y={285} zone={paint} />
          <ZoneLabel x={250} y={185} zone={mid} />
          <ZoneLabel x={70} y={340} zone={lc3} />
          <ZoneLabel x={430} y={340} zone={rc3} />
          <ZoneLabel x={250} y={85} zone={atb3} />

          {/* Zone names */}
          <text x="250" y="366" textAnchor="middle" fontSize="7" fill="#94a3b8">RESTRICTED</text>
          <text x="250" y="300" textAnchor="middle" fontSize="7" fill="#94a3b8">PAINT</text>
          <text x="250" y="200" textAnchor="middle" fontSize="7" fill="#94a3b8">MID-RANGE</text>
          <text x="70" y="360" textAnchor="middle" fontSize="7" fill="#94a3b8">L CORNER</text>
          <text x="430" y="360" textAnchor="middle" fontSize="7" fill="#94a3b8">R CORNER</text>
          <text x="250" y="100" textAnchor="middle" fontSize="7" fill="#94a3b8">ABOVE BREAK 3</text>

          {/* Legend */}
          <g transform="translate(50, 10)">
            {[
              { color: '#ef4444', label: '<35%' },
              { color: '#fb923c', label: '35-39%' },
              { color: '#fbbf24', label: '40-44%' },
              { color: '#4ade80', label: '45-49%' },
              { color: '#22c55e', label: '50%+' },
            ].map((item, i) => (
              <g key={i} transform={`translate(${i * 80}, 0)`}>
                <rect width="12" height="12" fill={item.color} fillOpacity="0.5" rx="2" />
                <text x="16" y="10" fontSize="9" fill="#64748b">{item.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
