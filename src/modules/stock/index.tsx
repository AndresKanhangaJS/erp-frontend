import { Route, Routes } from 'react-router'

import { ModuleTabs, type ModuleTabsItem } from '@/shared/components/layout/ModuleTabs'

import ArmazensPage from './pages/ArmazensPage'
import DetalheInventarioPage from './pages/DetalheInventarioPage'
import DetalheMovimentoPage from './pages/DetalheMovimentoPage'
import ExistenciasPage from './pages/ExistenciasPage'
import InventarioFormPage from './pages/InventarioFormPage'
import InventariosPage from './pages/InventariosPage'
import MovimentosPage from './pages/MovimentosPage'
import TransferenciaPage from './pages/TransferenciaPage'

const NAV: ModuleTabsItem[] = [
  { label: 'Existências', href: '/stock', end: true },
  { label: 'Movimentos', href: '/stock/movimentos' },
  { label: 'Inventários', href: '/stock/inventarios' },
  { label: 'Armazéns', href: '/stock/armazens' },
]

/** Montado em /stock/* pelo router — routing interno do módulo. */
export default function StockModule() {
  return (
    <div className="space-y-6">
      <ModuleTabs items={NAV} />
      <Routes>
        <Route index element={<ExistenciasPage />} />
        <Route path="movimentos" element={<MovimentosPage />} />
        <Route path="movimentos/transferir" element={<TransferenciaPage />} />
        <Route path="movimentos/:id" element={<DetalheMovimentoPage />} />
        <Route path="inventarios" element={<InventariosPage />} />
        <Route path="inventarios/novo" element={<InventarioFormPage />} />
        <Route path="inventarios/:id" element={<DetalheInventarioPage />} />
        <Route path="armazens" element={<ArmazensPage />} />
      </Routes>
    </div>
  )
}
