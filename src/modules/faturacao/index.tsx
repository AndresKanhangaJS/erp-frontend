import { Route, Routes } from 'react-router'

import ArtigoFormPage from './pages/ArtigoFormPage'
import ArtigosPage from './pages/ArtigosPage'
import ClienteFormPage from './pages/ClienteFormPage'
import ClientesPage from './pages/ClientesPage'
import DetalheFaturaPage from './pages/DetalheFaturaPage'
import EmitirFaturaPage from './pages/EmitirFaturaPage'
import FaturasPage from './pages/FaturasPage'
import PeriodosFiscaisPage from './pages/PeriodosFiscaisPage'
import SaftExportPage from './pages/SaftExportPage'
import SerieFormPage from './pages/SerieFormPage'
import SeriesPage from './pages/SeriesPage'
import TaxasCambioPage from './pages/TaxasCambioPage'

/** Montado em /faturacao/* pelo router (Passo 8) — routing interno do módulo. */
export default function FaturacaoModule() {
  return (
    <Routes>
      <Route index element={<FaturasPage />} />
      <Route path="emitir" element={<EmitirFaturaPage />} />
      <Route path="faturas/:id" element={<DetalheFaturaPage />} />
      <Route path="clientes" element={<ClientesPage />} />
      <Route path="clientes/novo" element={<ClienteFormPage />} />
      <Route path="clientes/:id" element={<ClienteFormPage />} />
      <Route path="artigos" element={<ArtigosPage />} />
      <Route path="artigos/novo" element={<ArtigoFormPage />} />
      <Route path="series" element={<SeriesPage />} />
      <Route path="series/nova" element={<SerieFormPage />} />
      <Route path="periodos-fiscais" element={<PeriodosFiscaisPage />} />
      <Route path="taxas-cambio" element={<TaxasCambioPage />} />
      <Route path="saft" element={<SaftExportPage />} />
    </Routes>
  )
}
