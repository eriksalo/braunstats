import { useState, useMemo } from 'react'
import clsx from 'clsx'
import { useAppContext } from '../hooks/useAppContext'
import { useSortableTable } from '../hooks/useSortableTable'
import { formatPct, formatPlusMinus, formatNumber, formatDate, getOpponent, bgStatColor } from '../utils/formatters'
import { gameLog } from '../data'
import type { GameLogEntry } from '../types'

type SortableKey = keyof GameLogEntry

export function GameLogPage() {
  const { season } = useAppContext()
  const [filterOpp, setFilterOpp] = useState('')
  const [filterWL, setFilterWL] = useState<'' | 'W' | 'L'>('')

  const seasonGames = useMemo(() => {
    let games = gameLog.games.filter(g => g.SEASON === season && g.SEASON_TYPE === 'Regular Season')
    if (filterOpp) games = games.filter(g => getOpponent(g.MATCHUP) === filterOpp)
    if (filterWL) games = games.filter(g => g.WL === filterWL)
    return games
  }, [season, filterOpp, filterWL])

  const opponents = useMemo(() => {
    const opps = new Set(
      gameLog.games.filter(g => g.SEASON === season).map(g => getOpponent(g.MATCHUP))
    )
    return Array.from(opps).sort()
  }, [season])

  const { sorted, sortKey, sortDir, requestSort } = useSortableTable<GameLogEntry>(
    seasonGames,
    'GAME_DATE' as SortableKey
  )

  const columns: { key: SortableKey; label: string; fmt?: (v: GameLogEntry) => string; thresholds?: { good: number; bad: number }; field?: SortableKey }[] = [
    { key: 'GAME_DATE', label: 'Date', fmt: g => formatDate(g.GAME_DATE) },
    { key: 'MATCHUP', label: 'Matchup', fmt: g => g.MATCHUP },
    { key: 'WL', label: 'W/L' },
    { key: 'MIN', label: 'MIN', fmt: g => formatNumber(g.MIN, 0) },
    { key: 'PTS', label: 'PTS', thresholds: { good: 20, bad: 5 } },
    { key: 'REB', label: 'REB', thresholds: { good: 8, bad: 2 } },
    { key: 'AST', label: 'AST', thresholds: { good: 5, bad: 0 } },
    { key: 'FG_PCT', label: 'FG%', fmt: g => formatPct(g.FG_PCT), thresholds: { good: 0.5, bad: 0.35 }, field: 'FG_PCT' },
    { key: 'FG3_PCT', label: '3P%', fmt: g => formatPct(g.FG3_PCT), thresholds: { good: 0.4, bad: 0.25 }, field: 'FG3_PCT' },
    { key: 'STL', label: 'STL' },
    { key: 'BLK', label: 'BLK' },
    { key: 'TOV', label: 'TOV' },
    { key: 'PLUS_MINUS', label: '+/-', fmt: g => formatPlusMinus(g.PLUS_MINUS), thresholds: { good: 5, bad: -5 }, field: 'PLUS_MINUS' },
  ]

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex flex-wrap gap-3 items-center">
        <h2 className="text-lg font-bold text-navy">Game Log</h2>
        <select
          value={filterOpp}
          onChange={e => setFilterOpp(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md"
        >
          <option value="">All Opponents</option>
          {opponents.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select
          value={filterWL}
          onChange={e => setFilterWL(e.target.value as '' | 'W' | 'L')}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md"
        >
          <option value="">W/L</option>
          <option value="W">Wins</option>
          <option value="L">Losses</option>
        </select>
        <span className="text-xs text-gray-400">{sorted.length} games</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key as string}
                  onClick={() => requestSort(col.key)}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((g, i) => (
              <tr key={i} className={clsx('hover:bg-gray-50', g.WL === 'L' && 'bg-red-50/30')}>
                {columns.map(col => {
                  const val = g[col.field ?? col.key]
                  const display = col.fmt ? col.fmt(g) : String(val ?? '')
                  return (
                    <td
                      key={col.key as string}
                      className={clsx(
                        'px-3 py-2 whitespace-nowrap',
                        col.thresholds && typeof val === 'number' && bgStatColor(val, col.thresholds)
                      )}
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
