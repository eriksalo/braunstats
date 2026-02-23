import { useAppContext } from '../hooks/useAppContext'
import { ImpactSummary } from '../components/JokicImpact/ImpactSummary'
import { DeltaCard } from '../components/JokicImpact/DeltaCard'
import { OnOffBarChart } from '../components/JokicImpact/OnOffBarChart'
import { OnOffRadar } from '../components/JokicImpact/OnOffRadar'
import { formatNumber, formatPct, formatPlusMinus } from '../utils/formatters'
import { onOffJokic } from '../data'

export function JokicImpactPage() {
  const { season } = useAppContext()
  const seasonData = onOffJokic.on_off[season]
  const lineupPair = onOffJokic.lineup_pairs[season]

  if (!seasonData?.base?.jokic_on || !seasonData?.base?.jokic_off) {
    return <p className="text-gray-400">No on/off data available for {season}.</p>
  }

  const baseOn = seasonData.base.jokic_on
  const baseOff = seasonData.base.jokic_off
  const advOn = seasonData.advanced?.jokic_on
  const advOff = seasonData.advanced?.jokic_off

  return (
    <div className="space-y-6 max-w-5xl">
      <ImpactSummary
        ptsOn={baseOn.PTS}
        ptsOff={baseOff.PTS}
        netOn={advOn?.NET_RATING ?? 0}
        netOff={advOff?.NET_RATING ?? 0}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <DeltaCard
          label="Points"
          onValue={formatNumber(baseOn.PTS)}
          offValue={formatNumber(baseOff.PTS)}
          delta={baseOn.PTS - baseOff.PTS}
          formatDelta={n => n.toFixed(1)}
        />
        <DeltaCard
          label="Rebounds"
          onValue={formatNumber(baseOn.REB)}
          offValue={formatNumber(baseOff.REB)}
          delta={baseOn.REB - baseOff.REB}
          formatDelta={n => n.toFixed(1)}
        />
        <DeltaCard
          label="Assists"
          onValue={formatNumber(baseOn.AST)}
          offValue={formatNumber(baseOff.AST)}
          delta={baseOn.AST - baseOff.AST}
          formatDelta={n => n.toFixed(1)}
        />
        <DeltaCard
          label="FG%"
          onValue={formatPct(baseOn.FG_PCT)}
          offValue={formatPct(baseOff.FG_PCT)}
          delta={(baseOn.FG_PCT - baseOff.FG_PCT) * 100}
          formatDelta={n => n.toFixed(1) + '%'}
        />
        <DeltaCard
          label="3P%"
          onValue={formatPct(baseOn.FG3_PCT)}
          offValue={formatPct(baseOff.FG3_PCT)}
          delta={(baseOn.FG3_PCT - baseOff.FG3_PCT) * 100}
          formatDelta={n => n.toFixed(1) + '%'}
        />
        <DeltaCard
          label="+/-"
          onValue={formatPlusMinus(baseOn.PLUS_MINUS)}
          offValue={formatPlusMinus(baseOff.PLUS_MINUS)}
          delta={baseOn.PLUS_MINUS - baseOff.PLUS_MINUS}
          formatDelta={n => n.toFixed(1)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OnOffBarChart on={baseOn} off={baseOff} />
        {advOn && advOff && <OnOffRadar on={advOn} off={advOff} />}
      </div>

      {lineupPair && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Braun + Jokic Lineup Pair</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-400">Games</p>
              <p className="text-lg font-bold">{lineupPair.GP}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Record</p>
              <p className="text-lg font-bold">{lineupPair.W}-{lineupPair.L}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">+/-</p>
              <p className="text-lg font-bold">{formatPlusMinus(lineupPair.PLUS_MINUS)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">FG%</p>
              <p className="text-lg font-bold">{formatPct(lineupPair.FG_PCT)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
