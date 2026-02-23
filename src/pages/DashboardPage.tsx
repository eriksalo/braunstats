import { useAppContext } from '../hooks/useAppContext'
import { PlayerBio } from '../components/Dashboard/PlayerBio'
import { StatCard } from '../components/Dashboard/StatCard'
import { formatPct, formatPlusMinus, formatNumber } from '../utils/formatters'
import { playerOverview, generalSplits } from '../data'

export function DashboardPage() {
  const { season } = useAppContext()
  const seasonData = generalSplits[season]
  const overall = seasonData?.overall?.[0]

  return (
    <div className="space-y-6 max-w-5xl">
      <PlayerBio info={playerOverview.info} />

      {overall ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <StatCard label="PPG" value={formatNumber(overall.PTS)} highlight />
          <StatCard label="RPG" value={formatNumber(overall.REB)} />
          <StatCard label="APG" value={formatNumber(overall.AST)} />
          <StatCard label="FG%" value={formatPct(overall.FG_PCT)} />
          <StatCard label="3P%" value={formatPct(overall.FG3_PCT)} />
          <StatCard label="+/-" value={formatPlusMinus(overall.PLUS_MINUS)} />
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No data available for {season}.</p>
      )}

      {overall && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Games" value={String(overall.GP)} />
          <StatCard label="Record" value={`${overall.W}-${overall.L}`} />
          <StatCard label="MPG" value={formatNumber(overall.MIN)} />
          <StatCard label="FT%" value={formatPct(overall.FT_PCT)} />
          <StatCard label="SPG" value={formatNumber(overall.STL)} />
          <StatCard label="BPG" value={formatNumber(overall.BLK)} />
          <StatCard label="TOV" value={formatNumber(overall.TOV)} />
          <StatCard label="FGM-FGA" value={`${formatNumber(overall.FGM)}-${formatNumber(overall.FGA)}`} />
        </div>
      )}
    </div>
  )
}
