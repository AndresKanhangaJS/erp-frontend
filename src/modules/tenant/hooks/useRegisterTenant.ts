import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { registerTenant } from '@/api/modules/tenant'
import { useAuthStore } from '@/shared/stores/authStore'
import { useTenantStore } from '@/shared/stores/tenantStore'

import type { RegisterTenantFormValues } from '../schemas/registerTenantSchema'

/**
 * Regista a empresa e entra logo — o backend já devolve token,
 * permissões e módulos activos no mesmo pedido (ver
 * RegisterTenantAction, erp-api), não é preciso fazer login a seguir.
 */
export function useRegisterTenant() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: RegisterTenantFormValues) =>
      registerTenant({
        nomeEmpresa: values.nomeEmpresa,
        nif: values.nif,
        adminNome: values.adminNome,
        adminEmail: values.adminEmail,
        adminPassword: values.adminPassword,
        adminPasswordConfirmation: values.adminPasswordConfirmation,
        plano: values.plano,
      }),
    onSuccess: (result) => {
      useTenantStore.getState().setTenant({
        tenantId: result.tenantId,
        plan: null,
        activeModules: result.activeModules,
      })
      useAuthStore.getState().setAuth({
        token: result.token,
        user: result.user,
        permissions: result.permissions,
      })
      navigate('/', { replace: true })
    },
  })
}
