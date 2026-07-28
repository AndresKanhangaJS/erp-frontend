import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/shared/hooks/useAuth'

/** Redirect para /login se não autenticado. */
export function AuthGuard() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
