import { useAppContext } from '../hooks/useAppContext'
import { ImpactSummary } from '../components/JokicImpact/ImpactSummary'
import { DeltaCard } from '../components/JokicImpact/DeltaCard'
import { OnOffBarChart } from '../components/JokicImpact/OnOffBarChart'
import { OnOffRadar } from '../components/JokicImpact/OnOffRadar'
import { formatPlusMinus } from '../utils/formatters'
import { onOffJokic } from '../data'

export function JokicImpactPage() {
  const { season } = useAppContext()
  const seasonData = onOffJokic.on_off[season]

  if (!seasonData?.base?.jokic_on || !seasonData?.base?.jokic_off) {
    return <p className="text-gray-400">No on/off data available for {season}.</p>
  }

  const advOn = seasonData.advanced?.jokic_on
  const advOff = seasonData.advanced?.jokic_off

  if (!advOn || !advOff) {
    return <p className="text-gray-400">No advanced on/off data available for {season}.</p>
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <ImpactSummary
        ortgOn={advOn.OFF_RATING}
        ortgOff={advOff.OFF_RATING}
        netOn={advOn.NET_RATING}
        netOff={advOff.NET_RATING}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <DeltaCard
          label="Off Rating"
          onValue={advOn.OFF_RATING.toFixed(1)}
          offValue={advOff.OFF_RATING.toFixed(1)}
          delta={advOn.OFF_RATING - advOff.OFF_RATING}
          formatDelta={n => n.toFixed(1)}
        />
        <DeltaCard
          label="Def Rating"
          onValue={advOff.DEF_RATING.toFixed(1)}
          offValue={advOn.DEF_RATING.toFixed(1)}
          delta={advOff.DEF_RATING - advOn.DEF_RATING}
          formatDelta={n => n.toFixed(1)}
          invertColor
        />
        <DeltaCard
          label="Net Rating"
          onValue={formatPlusMinus(advOn.NET_RATING)}
          offValue={formatPlusMinus(advOff.NET_RATING)}
          delta={advOn.NET_RATING - advOff.NET_RATING}
          formatDelta={n => formatPlusMinus(n)}
        />
        <DeltaCard
          label="Team eFG%"
          onValue={(advOn.EFG_PCT * 100).toFixed(1) + '%'}
          offValue={(advOff.EFG_PCT * 100).toFixed(1) + '%'}
          delta={(advOn.EFG_PCT - advOff.EFG_PCT) * 100}
          formatDelta={n => n.toFixed(1) + '%'}
        />
        <DeltaCard
          label="Team AST%"
          onValue={advOn.AST_PCT.toFixed(1) + '%'}
          offValue={advOff.AST_PCT.toFixed(1) + '%'}
          delta={advOn.AST_PCT - advOff.AST_PCT}
          formatDelta={n => n.toFixed(1) + '%'}
        />
        <DeltaCard
          label="Team REB%"
          onValue={advOn.REB_PCT.toFixed(1) + '%'}
          offValue={advOff.REB_PCT.toFixed(1) + '%'}
          delta={advOn.REB_PCT - advOff.REB_PCT}
          formatDelta={n => n.toFixed(1) + '%'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OnOffBarChart on={advOn} off={advOff} />
        <OnOffRadar on={advOn} off={advOff} />
      </div>
    </div>
  )
}
