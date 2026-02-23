import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'
import type { Season } from '../../types'
import { DEFAULT_SEASON } from '../../types'
import { meta } from '../../data'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [season, setSeason] = useState<Season>(DEFAULT_SEASON)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          season={season}
          onSeasonChange={setSeason}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ season, setSeason }} />
        </main>
        <Footer generatedAt={meta.generated_at} />
      </div>
    </div>
  )
}
