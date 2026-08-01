import { Navigate, Outlet } from 'react-router'

import { usePermission } from '@/shared/hooks/usePermission'

interface PermissionRouteGuardProps {
  permission: string
}

/**
 * Protege uma rota inteira contra acesso directo por URL sem a
 * permissão — a navegação já esconde o link para quem não a tem (ver
 * Sidebar). Diferente do PermissionGuard (shared/components/ui), que
 * esconde acções dentro de uma página já acessível.
 */
export function PermissionRouteGuard({ permission }: PermissionRouteGuardProps) {
  const hasPermission = usePermission(permission)

  if (!hasPermission) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
