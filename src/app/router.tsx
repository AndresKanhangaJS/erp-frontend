import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/shared/components/layout/AppShell'

import { AuthGuard } from './guards/AuthGuard'
import { ModuleGuard } from './guards/ModuleGuard'
import { UpgradePage } from './pages/UpgradePage'

const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'))
const FaturacaoModule = lazy(() => import('@/modules/faturacao'))
const ContabilidadeModule = lazy(() => import('@/modules/contabilidade'))
const RhModule = lazy(() => import('@/modules/rh'))
const ComercialModule = lazy(() => import('@/modules/comercial'))
const StockModule = lazy(() => import('@/modules/stock'))
const RelatoriosModule = lazy(() => import('@/modules/relatorios'))

function ModuleFallback() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<ModuleFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AuthGuard />}>
            <Route element={<AppShellLayout />}>
              <Route index element={<Navigate to="/faturacao" replace />} />
              <Route path="planos" element={<UpgradePage />} />

              <Route element={<ModuleGuard module="faturacao" />}>
                <Route path="faturacao/*" element={<FaturacaoModule />} />
              </Route>
              <Route element={<ModuleGuard module="contabilidade" />}>
                <Route path="contabilidade/*" element={<ContabilidadeModule />} />
              </Route>
              <Route element={<ModuleGuard module="rh" />}>
                <Route path="rh/*" element={<RhModule />} />
              </Route>
              <Route element={<ModuleGuard module="comercial" />}>
                <Route path="comercial/*" element={<ComercialModule />} />
              </Route>
              <Route element={<ModuleGuard module="stock" />}>
                <Route path="stock/*" element={<StockModule />} />
              </Route>
              <Route element={<ModuleGuard module="relatorios" />}>
                <Route path="relatorios/*" element={<RelatoriosModule />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
