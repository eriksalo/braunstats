import type { Season } from '../../types'
import { SEASONS } from '../../types'

interface HeaderProps {
  season: Season
  onSeasonChange: (s: Season) => void
  onMenuToggle: () => void
}

export function Header({ season, onSeasonChange, onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-navy">
          Christian Braun
          <span className="text-gray-400 font-normal ml-2">#0</span>
        </h1>
      </div>
      <select
        value={season}
        onChange={e => onSeasonChange(e.target.value as Season)}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
      >
        {SEASONS.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </header>
  )
}
