import { Route, Routes } from 'react-router'

import ArtigosPage from './pages/ArtigosPage'
import ClientesPage from './pages/ClientesPage'
import DetalheDocumentoPage from './pages/DetalheDocumentoPage'
import DocumentosPage from './pages/DocumentosPage'
import EmitirFaturaPage from './pages/EmitirFaturaPage'
import SeriesPage from './pages/SeriesPage'

/** Montado em /faturacao/* pelo router (Passo 8) — routing interno do módulo. */
export default function FaturacaoModule() {
  return (
    <Routes>
      <Route index element={<DocumentosPage />} />
      <Route path="emitir" element={<EmitirFaturaPage />} />
      <Route path="documentos/:id" element={<DetalheDocumentoPage />} />
      <Route path="clientes" element={<ClientesPage />} />
      <Route path="artigos" element={<ArtigosPage />} />
      <Route path="series" element={<SeriesPage />} />
    </Routes>
  )
}
