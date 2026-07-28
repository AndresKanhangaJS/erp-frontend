import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { login, type LoginPayload } from '@/api/modules/auth'
import { useAuthStore } from '@/shared/stores/authStore'
import { useTenantStore } from '@/shared/stores/tenantStore'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      useAuthStore.getState().setAuth({
        token: data.token,
        user: data.user,
        permissions: data.permissions,
      })
      useTenantStore.getState().setTenant({
        tenantId: data.tenant.id,
        plan: data.tenant.plan,
        activeModules: data.tenant.active_modules,
      })
      navigate('/', { replace: true })
    },
  })
}
