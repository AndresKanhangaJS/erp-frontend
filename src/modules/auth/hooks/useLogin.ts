import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { login, type LoginPayload } from '@/api/modules/auth'
import { useAuthStore } from '@/shared/stores/authStore'
import { useTenantStore } from '@/shared/stores/tenantStore'

const MODULE_SLUGS = ['faturacao', 'contabilidade', 'rh', 'comercial', 'stock', 'relatorios']

/**
 * O backend ainda não tem nenhum endpoint de plano/módulos activos do
 * tenant (confirmado via `artisan route:list` — só existem rotas de
 * Auth e Admin/Users). Até isso existir, inferimos os módulos activos
 * a partir dos prefixos das permissões reais que o login devolve
 * (ex.: "faturacao.ver" → módulo "faturacao" activo). É uma
 * aproximação deliberada e assinalada, não uma suposição às cegas.
 */
function deriveActiveModules(permissions: string[]): string[] {
  const prefixes = new Set(permissions.map((permission) => permission.split('.')[0]))
  return MODULE_SLUGS.filter((slug) => prefixes.has(slug))
}

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
      useTenantStore.setState({ activeModules: deriveActiveModules(result.permissions) })
      navigate('/', { replace: true })
    },
  })
}
