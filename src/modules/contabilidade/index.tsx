import { Route, Routes } from 'react-router'

import BalancetePage from './pages/BalancetePage'
import BalancoPage from './pages/BalancoPage'
import ContaFormPage from './pages/ContaFormPage'
import DemonstracaoResultadosPage from './pages/DemonstracaoResultadosPage'
import DetalheLancamentoPage from './pages/DetalheLancamentoPage'
import LancamentosPage from './pages/LancamentosPage'
import NovoLancamentoPage from './pages/NovoLancamentoPage'
import PeriodosPage from './pages/PeriodosPage'
import PlanoContasPage from './pages/PlanoContasPage'

/** Montado em /contabilidade/* pelo router (Passo 8) — routing interno do módulo. */
export default function ContabilidadeModule() {
  return (
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
      <Route path="periodos" element={<PeriodosPage />} />
    </Routes>
  )
}
