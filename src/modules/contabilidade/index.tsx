import { Route, Routes } from 'react-router'

import { ModuleTabs, type ModuleTabsItem } from '@/shared/components/layout/ModuleTabs'

import ApuramentoIvaPage from './pages/ApuramentoIvaPage'
import BalancetePage from './pages/BalancetePage'
import BalancoPage from './pages/BalancoPage'
import ContaFormPage from './pages/ContaFormPage'
import DemonstracaoResultadosPage from './pages/DemonstracaoResultadosPage'
import DetalheLancamentoPage from './pages/DetalheLancamentoPage'
import LancamentosPage from './pages/LancamentosPage'
import NovoLancamentoPage from './pages/NovoLancamentoPage'
import PeriodosPage from './pages/PeriodosPage'
import PlanoContasPage from './pages/PlanoContasPage'

const NAV: ModuleTabsItem[] = [
  { label: 'Lançamentos', href: '/contabilidade', end: true },
  { label: 'Plano de contas', href: '/contabilidade/plano-de-contas' },
  { label: 'Balancete', href: '/contabilidade/balancete' },
  { label: 'Balanço', href: '/contabilidade/balanco' },
  { label: 'Demonstração de Resultados', href: '/contabilidade/demonstracao-resultados' },
  { label: 'Apuramento de IVA', href: '/contabilidade/apuramento-iva' },
  { label: 'Períodos', href: '/contabilidade/periodos' },
]

/** Montado em /contabilidade/* pelo router (Passo 8) — routing interno do módulo. */
export default function ContabilidadeModule() {
  return (
    <div className="space-y-6">
      <ModuleTabs items={NAV} />
      <Routes>
        <Route index element={<LancamentosPage />} />
        <Route path="lancamentos" element={<LancamentosPage />} />
        <Route path="lancamentos/novo" element={<NovoLancamentoPage />} />
        <Route path="lancamentos/:id" element={<DetalheLancamentoPage />} />
        <Route path="plano-de-contas" element={<PlanoContasPage />} />
        <Route path="plano-de-contas/nova" element={<ContaFormPage />} />
        <Route path="plano-de-contas/:id" element={<ContaFormPage />} />
        <Route path="balancete" element={<BalancetePage />} />
        <Route path="balanco" element={<BalancoPage />} />
        <Route path="demonstracao-resultados" element={<DemonstracaoResultadosPage />} />
        <Route path="apuramento-iva" element={<ApuramentoIvaPage />} />
        <Route path="periodos" element={<PeriodosPage />} />
      </Routes>
    </div>
  )
}
