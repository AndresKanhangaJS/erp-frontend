import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  permissions: string[]
  setAuth: (params: { token: string; user: AuthUser; permissions: string[] }) => void
  logout: () => void
}

/**
 * Persistida em localStorage — o interceptor do axios (src/api/client.ts)
 * lê o token daqui em cada pedido, fora de qualquer componente React.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      permissions: [],
      setAuth: ({ token, user, permissions }) => set({ token, user, permissions }),
      logout: () => set({ token: null, user: null, permissions: [] }),
    }),
    { name: 'erp-auth' },
  ),
)
