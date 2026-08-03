import { Route, Routes } from 'react-router'

import { PermissionRouteGuard } from '@/app/guards/PermissionRouteGuard'
import { ModuleTabs, type ModuleTabsItem } from '@/shared/components/layout/ModuleTabs'
import { usePermission } from '@/shared/hooks/usePermission'

import AgtConfiguracaoPage from './pages/AgtConfiguracaoPage'
import AgtSeriesPage from './pages/AgtSeriesPage'
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

const NAV_BASE: ModuleTabsItem[] = [
  { label: 'Facturas', href: '/faturacao', end: true },
  { label: 'Clientes', href: '/faturacao/clientes' },
  { label: 'Artigos', href: '/faturacao/artigos' },
  { label: 'Séries', href: '/faturacao/series' },
]

const NAV_CONFIGURACAO: ModuleTabsItem[] = [
  { label: 'Períodos fiscais', href: '/faturacao/periodos-fiscais' },
  { label: 'Taxas de câmbio', href: '/faturacao/taxas-cambio' },
]

/**
 * Períodos fiscais e taxas de câmbio exigem "admin.configurar_empresa"
 * no backend (PeriodoFiscalPolicy/TaxaCambioPolicy) — nem toda a role
 * com acesso a Facturação a tem, incluindo a role "admin" (ver
 * RolesAndPermissionsSeeder, erp-api). SAF-T exige "faturacao.exportar_saft"
 * (FaturaPolicy::exportarSaft). Mostrar o separador para quem não tem
 * a permissão só leva a um 403 na primeira visita.
 */
export default function FaturacaoModule() {
  const podeConfigurarEmpresa = usePermission('admin.configurar_empresa')
  const podeExportarSaft = usePermission('faturacao.exportar_saft')
  const podeVerAgt = usePermission('faturacao.agt_ver')
  const podeGerirSeriesAgt = usePermission('faturacao.agt_gerir_series')
  const nav = [
    ...NAV_BASE,
    ...(podeExportarSaft ? [{ label: 'SAF-T', href: '/faturacao/saft' }] : []),
    ...(podeConfigurarEmpresa ? NAV_CONFIGURACAO : []),
    ...(podeVerAgt ? [{ label: 'Configuração AGT', href: '/faturacao/agt/configuracao' }] : []),
    ...(podeGerirSeriesAgt ? [{ label: 'Séries AGT', href: '/faturacao/agt/series' }] : []),
  ]

  return (
    <div className="space-y-6">
      <ModuleTabs items={nav} />
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
        <Route element={<PermissionRouteGuard permission="admin.configurar_empresa" />}>
          <Route path="periodos-fiscais" element={<PeriodosFiscaisPage />} />
          <Route path="taxas-cambio" element={<TaxasCambioPage />} />
        </Route>
        <Route element={<PermissionRouteGuard permission="faturacao.exportar_saft" />}>
          <Route path="saft" element={<SaftExportPage />} />
        </Route>
        <Route element={<PermissionRouteGuard permission="faturacao.agt_ver" />}>
          <Route path="agt/configuracao" element={<AgtConfiguracaoPage />} />
        </Route>
        <Route element={<PermissionRouteGuard permission="faturacao.agt_gerir_series" />}>
          <Route path="agt/series" element={<AgtSeriesPage />} />
        </Route>
      </Routes>
    </div>
  )
}
