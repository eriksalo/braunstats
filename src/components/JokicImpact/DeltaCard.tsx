import clsx from 'clsx'

interface DeltaCardProps {
  label: string
  onValue: string
  offValue: string
  delta: number
  formatDelta: (n: number) => string
  higherIsBetter?: boolean
}

export function DeltaCard({ label, onValue, offValue, delta, formatDelta, higherIsBetter = true }: DeltaCardProps) {
  const isPositive = higherIsBetter ? delta > 0 : delta < 0
  const isNegative = higherIsBetter ? delta < 0 : delta > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <div className="text-center flex-1">
          <p className="text-xs text-gray-400 mb-1">Jokic ON</p>
          <p className="text-xl font-bold text-navy">{onValue}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-gray-400 mb-1">Jokic OFF</p>
          <p className="text-xl font-bold text-gray-500">{offValue}</p>
        </div>
        <div
          className={clsx(
            'text-center flex-1 px-2 py-1 rounded-lg',
            isPositive && 'bg-green-50',
            isNegative && 'bg-red-50',
            !isPositive && !isNegative && 'bg-gray-50'
          )}
        >
          <p className="text-xs text-gray-400 mb-1">Delta</p>
          <p
            className={clsx(
              'text-lg font-bold',
              isPositive && 'text-positive',
              isNegative && 'text-negative',
              !isPositive && !isNegative && 'text-gray-500'
            )}
          >
            {delta > 0 ? '+' : ''}{formatDelta(delta)}
          </p>
        </div>
      </div>
    </div>
  )
}
