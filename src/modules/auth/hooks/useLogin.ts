import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { login, type LoginPayload } from '@/api/modules/auth'
import { useAuthStore } from '@/shared/stores/authStore'
import { useTenantStore } from '@/shared/stores/tenantStore'

export interface LoginFormPayload extends LoginPayload {
  tenantId: string
}

/**
 * O X-Tenant-ID é exigido pelo backend mesmo no login (ver
 * docs/api-contract.md na raiz do monorepo) — o interceptor do axios
 * só o envia a partir do tenantStore, por isso tem de lá estar ANTES
 * do pedido disparar. Sem isto era um impasse: precisar de tenant
 * para conseguir logar, e de login para ter tenant.
 */
export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ tenantId, ...credentials }: LoginFormPayload) => {
      useTenantStore.getState().setTenant({ tenantId, plan: null, activeModules: [] })
      try {
        return await login(credentials)
      } catch (error) {
        useTenantStore.getState().clearTenant()
        throw error
      }
    },
    onSuccess: (result) => {
      useAuthStore.getState().setAuth({
        token: result.token,
        user: result.user,
        permissions: result.permissions,
      })
      useTenantStore.setState({ activeModules: result.activeModules })
      navigate(result.mustChangePassword ? '/trocar-password' : '/', { replace: true })
    },
  })
}
