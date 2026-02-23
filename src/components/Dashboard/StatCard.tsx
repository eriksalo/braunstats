import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string
  subtitle?: string
  highlight?: boolean
}

export function StatCard({ label, value, subtitle, highlight }: StatCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border p-4 text-center',
        highlight ? 'bg-gold/10 border-gold' : 'bg-white border-gray-200'
      )}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={clsx('text-2xl font-bold mt-1', highlight ? 'text-navy' : 'text-gray-900')}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}
