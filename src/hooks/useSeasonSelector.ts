import { useState } from 'react'
import type { Season } from '../types'
import { DEFAULT_SEASON } from '../types'

export function useSeasonSelector(initial: Season = DEFAULT_SEASON) {
  const [season, setSeason] = useState<Season>(initial)
  return { season, setSeason }
}
