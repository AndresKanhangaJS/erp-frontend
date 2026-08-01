import { useMutation } from '@tanstack/react-query'

import { resetPassword } from '@/api/modules/auth'
import { useTenantStore } from '@/shared/stores/tenantStore'

import type { ResetPasswordFormValues } from '../schemas/resetPasswordSchema'

interface ResetPasswordArgs extends ResetPasswordFormValues {
  token: string
}

/** X-Tenant-ID é exigido mesmo aqui (ver useLogin.ts) — tem de estar no tenantStore antes do pedido disparar. */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ tenantId, token, password, passwordConfirmation }: ResetPasswordArgs) => {
      useTenantStore.getState().setTenant({ tenantId, plan: null, activeModules: [] })
      return resetPassword({ token, password, passwordConfirmation })
    },
  })
}
