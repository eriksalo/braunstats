interface ImpactSummaryProps {
  ortgOn: number
  ortgOff: number
  netOn: number
  netOff: number
}

export function ImpactSummary({ ortgOn, ortgOff, netOn, netOff }: ImpactSummaryProps) {
  const ortgDiff = ortgOn - ortgOff
  const netDiff = netOn - netOff

  return (
    <div className="bg-navy text-white rounded-xl p-5 mb-6">
      <h2 className="text-gold text-sm font-semibold uppercase tracking-wide mb-1">
        The Jokic Effect
      </h2>
      <p className="text-xl md:text-2xl font-bold">
        Nuggets score{' '}
        <span className="text-gold">{Math.abs(ortgDiff).toFixed(1)} {ortgDiff > 0 ? 'more' : 'fewer'}</span>
        {' '}points per 100 possessions with Jokic
      </p>
      <p className="text-gray-300 mt-1 text-sm">
        Team net rating: {netOn > 0 ? '+' : ''}{netOn.toFixed(1)} on court
        vs {netOff > 0 ? '+' : ''}{netOff.toFixed(1)} off court
        {' '}(swing of <span className="text-gold font-semibold">{netDiff > 0 ? '+' : ''}{netDiff.toFixed(1)}</span>)
      </p>
      <p className="text-gray-400 mt-2 text-xs italic">
        Team-level stats from Basketball Reference showing how the Nuggets perform with Jokic on vs. off the court.
      </p>
    </div>
  )
}
