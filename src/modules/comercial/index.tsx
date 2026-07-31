import { Route, Routes } from 'react-router'

import { ModuleTabs, type ModuleTabsItem } from '@/shared/components/layout/ModuleTabs'

import DetalheOportunidadePage from './pages/DetalheOportunidadePage'
import LeadFormPage from './pages/LeadFormPage'
import LeadsPage from './pages/LeadsPage'
import OportunidadeFormPage from './pages/OportunidadeFormPage'
import OportunidadesPage from './pages/OportunidadesPage'
import PipelinesPage from './pages/PipelinesPage'

const NAV: ModuleTabsItem[] = [
  { label: 'Leads', href: '/comercial', end: true },
  { label: 'Oportunidades', href: '/comercial/oportunidades' },
  { label: 'Pipelines', href: '/comercial/pipelines' },
]

/** Montado em /comercial/* pelo router — routing interno do módulo. */
export default function ComercialModule() {
  return (
    <div className="space-y-6">
      <ModuleTabs items={NAV} />
      <Routes>
        <Route index element={<LeadsPage />} />
        <Route path="leads/novo" element={<LeadFormPage />} />
        <Route path="leads/:id" element={<LeadFormPage />} />
        <Route path="oportunidades" element={<OportunidadesPage />} />
        <Route path="oportunidades/nova" element={<OportunidadeFormPage />} />
        <Route path="oportunidades/:id" element={<DetalheOportunidadePage />} />
        <Route path="pipelines" element={<PipelinesPage />} />
      </Routes>
    </div>
  )
}
