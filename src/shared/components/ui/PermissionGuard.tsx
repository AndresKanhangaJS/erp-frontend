import type { ReactNode } from 'react'

import { usePermission } from '@/shared/hooks/usePermission'

interface PermissionGuardProps {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Esconde acções sem permissão — é só UX. O backend rejeita sempre;
 * o cliente nunca é a fonte de verdade (ADR-007).
 */
export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const hasPermission = usePermission(permission)
  return hasPermission ? <>{children}</> : <>{fallback}</>
}
