interface ImpactSummaryProps {
  ptsOn: number
  ptsOff: number
  netOn: number
  netOff: number
}

export function ImpactSummary({ ptsOn, ptsOff, netOn, netOff }: ImpactSummaryProps) {
  const ptsDiff = ptsOn - ptsOff
  const netDiff = netOn - netOff

  return (
    <div className="bg-navy text-white rounded-xl p-5 mb-6">
      <h2 className="text-gold text-sm font-semibold uppercase tracking-wide mb-1">
        The Jokic Effect
      </h2>
      <p className="text-xl md:text-2xl font-bold">
        The Nuggets score{' '}
        <span className="text-gold">{Math.abs(ptsDiff).toFixed(1)} {ptsDiff > 0 ? 'more' : 'fewer'} points</span>
        {' '}per game when Jokic plays
      </p>
      <p className="text-gray-300 mt-1 text-sm">
        Team net rating swings by {Math.abs(netDiff).toFixed(1)} points per 100 possessions
        ({netOn > 0 ? '+' : ''}{netOn.toFixed(1)} on court vs {netOff > 0 ? '+' : ''}{netOff.toFixed(1)} off court)
      </p>
      <p className="text-gray-400 mt-2 text-xs italic">
        Note: These are team-level stats showing how the Nuggets perform with Jokic on vs. off the court.
      </p>
    </div>
  )
}
