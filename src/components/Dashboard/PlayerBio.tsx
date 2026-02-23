import type { PlayerInfo } from '../../types'

const HEADSHOT_URL = 'https://cdn.nba.com/headshots/nba/latest/1040x760/1631128.png'

export function PlayerBio({ info }: { info: PlayerInfo }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl border border-gray-200 p-5">
      <img
        src={HEADSHOT_URL}
        alt={info.DISPLAY_FIRST_LAST}
        className="w-32 h-24 object-cover rounded-lg bg-gray-100"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-navy">{info.DISPLAY_FIRST_LAST}</h2>
        <p className="text-gray-500">
          #{info.JERSEY} · {info.POSITION} · {info.TEAM_CITY} {info.TEAM_NAME}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600 justify-center sm:justify-start">
          <span>{info.HEIGHT} · {info.WEIGHT} lbs</span>
          <span>{info.SCHOOL}</span>
          <span>{info.DRAFT_YEAR} Draft: Rd {info.DRAFT_ROUND}, Pick {info.DRAFT_NUMBER}</span>
        </div>
      </div>
    </div>
  )
}
