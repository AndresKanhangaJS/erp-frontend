import { Navigate, Outlet } from 'react-router'

import { useModules } from '@/shared/hooks/useModules'

interface ModuleGuardProps {
  module: string
}

/**
 * Página de upgrade se o módulo estiver inactivo no plano do tenant.
 * A Sidebar já esconde o acesso normal a módulos inactivos (badge
 * "Pro"), isto protege a rota em si contra acesso directo por URL.
 */
export function ModuleGuard({ module }: ModuleGuardProps) {
  const { isModuleActive } = useModules()

  if (!isModuleActive(module)) {
    return <Navigate to={`/planos?modulo=${module}`} replace />
  }

  return <Outlet />
}
