export function formatPct(value: number | null | undefined, decimals = 1): string {
  if (value == null) return '—'
  return (value * 100).toFixed(decimals) + '%'
}

export function formatPlusMinus(value: number | null | undefined): string {
  if (value == null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}`
}

export function formatNumber(value: number | null | undefined, decimals = 1): string {
  if (value == null) return '—'
  return value.toFixed(decimals)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getOpponent(matchup: string): string {
  const parts = matchup.split(' ')
  return parts[parts.length - 1]
}

export function isHomeGame(matchup: string): boolean {
  return matchup.includes('vs.')
}

export function statColor(value: number, thresholds: { good: number; bad: number }): string {
  if (value >= thresholds.good) return 'text-positive'
  if (value <= thresholds.bad) return 'text-negative'
  return ''
}

export function bgStatColor(value: number, thresholds: { good: number; bad: number }): string {
  if (value >= thresholds.good) return 'bg-green-50'
  if (value <= thresholds.bad) return 'bg-red-50'
  return ''
}
