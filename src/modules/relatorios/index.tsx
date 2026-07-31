import { Route, Routes } from 'react-router'

import DashboardPage from './pages/DashboardPage'

/** Montado em /relatorios/* pelo router — routing interno do módulo. */
export default function RelatoriosModule() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
    </Routes>
  )
}
