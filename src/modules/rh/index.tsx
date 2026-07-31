import { Route, Routes } from 'react-router'

import { ModuleTabs, type ModuleTabsItem } from '@/shared/components/layout/ModuleTabs'

import DetalheFolhaPage from './pages/DetalheFolhaPage'
import DetalheVencimentoPage from './pages/DetalheVencimentoPage'
import FolhasSalariaisPage from './pages/FolhasSalariaisPage'
import FuncionarioFormPage from './pages/FuncionarioFormPage'
import FuncionariosPage from './pages/FuncionariosPage'

const NAV: ModuleTabsItem[] = [
  { label: 'Funcionários', href: '/rh', end: true },
  { label: 'Folhas salariais', href: '/rh/folhas-salariais' },
]

/** Montado em /rh/* pelo router — routing interno do módulo. */
export default function RhModule() {
  return (
    <div className="space-y-6">
      <ModuleTabs items={NAV} />
      <Routes>
        <Route index element={<FuncionariosPage />} />
        <Route path="funcionarios/novo" element={<FuncionarioFormPage />} />
        <Route path="funcionarios/:id" element={<FuncionarioFormPage />} />
        <Route path="folhas-salariais" element={<FolhasSalariaisPage />} />
        <Route path="folhas-salariais/:id" element={<DetalheFolhaPage />} />
        <Route path="vencimentos/:id" element={<DetalheVencimentoPage />} />
      </Routes>
    </div>
  )
}
