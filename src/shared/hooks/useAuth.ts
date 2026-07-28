import { useShallow } from 'zustand/react/shallow'

import { useAuthStore } from '@/shared/stores/authStore'

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      permissions: state.permissions,
      isAuthenticated: state.token !== null,
      setAuth: state.setAuth,
      logout: state.logout,
    })),
  )
}
