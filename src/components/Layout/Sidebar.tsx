import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/jokic-impact', label: 'Jokic Impact', icon: '⭐' },
  { to: '/game-log', label: 'Game Log', icon: '📋' },
  { to: '/shooting', label: 'Shooting', icon: '🎯' },
  { to: '/trends', label: 'Trends', icon: '📈' },
  { to: '/splits', label: 'Splits', icon: '📉' },
  { to: '/career', label: 'Career', icon: '🏆' },
  { to: '/advanced', label: 'Advanced', icon: '🔬' },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-full w-56 bg-navy text-white transition-transform duration-200 lg:translate-x-0 lg:static lg:z-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col px-4 py-5 border-b border-navy-light">
          <span className="text-gold font-bold text-xl">BraunStats</span>
          <span className="text-gray-400 text-xs mt-0.5">Miranda's Website</span>
        </div>
        <nav className="p-2 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-blue text-gold font-semibold'
                    : 'text-gray-300 hover:bg-navy-light hover:text-white'
                )
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
