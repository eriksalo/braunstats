import { useOutletContext } from 'react-router-dom'
import type { Season } from '../types'

interface AppContext {
  season: Season
  setSeason: (s: Season) => void
}

export function useAppContext() {
  return useOutletContext<AppContext>()
}
