import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { JokicImpactPage } from './pages/JokicImpactPage'
import { GameLogPage } from './pages/GameLogPage'
import { ShootingPage } from './pages/ShootingPage'
import { TrendsPage } from './pages/TrendsPage'
import { SplitsPage } from './pages/SplitsPage'
import { CareerPage } from './pages/CareerPage'
import { AdvancedPage } from './pages/AdvancedPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="jokic-impact" element={<JokicImpactPage />} />
          <Route path="game-log" element={<GameLogPage />} />
          <Route path="shooting" element={<ShootingPage />} />
          <Route path="trends" element={<TrendsPage />} />
          <Route path="splits" element={<SplitsPage />} />
          <Route path="career" element={<CareerPage />} />
          <Route path="advanced" element={<AdvancedPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
