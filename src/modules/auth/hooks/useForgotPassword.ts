import { useMutation } from '@tanstack/react-query'

import { forgotPassword } from '@/api/modules/auth'
import { useTenantStore } from '@/shared/stores/tenantStore'

import type { ForgotPasswordFormValues } from '../schemas/forgotPasswordSchema'

/** X-Tenant-ID é exigido mesmo aqui (ver useLogin.ts) — tem de estar no tenantStore antes do pedido disparar. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ tenantId, email }: ForgotPasswordFormValues) => {
      useTenantStore.getState().setTenant({ tenantId, plan: null, activeModules: [] })
      return forgotPassword({ email })
    },
  })
}
