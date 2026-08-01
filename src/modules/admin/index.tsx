import { Route, Routes } from 'react-router'

import UtilizadorFormPage from './pages/UtilizadorFormPage'
import UtilizadoresPage from './pages/UtilizadoresPage'

/** Montado em /admin/* pelo router — routing interno do módulo. */
export default function AdminModule() {
  return (
    <Routes>
      <Route path="utilizadores" element={<UtilizadoresPage />} />
      <Route path="utilizadores/novo" element={<UtilizadorFormPage />} />
      <Route path="utilizadores/:id" element={<UtilizadorFormPage />} />
    </Routes>
  )
}
