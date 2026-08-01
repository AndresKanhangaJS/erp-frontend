import axios, { type AxiosError } from 'axios'
import { toast } from 'sonner'

import { useAuthStore } from '@/shared/stores/authStore'
import { useTenantStore } from '@/shared/stores/tenantStore'
import type { ApiErrorBody, PaginatedResponse } from '@/shared/types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()
  const { tenantId } = useTenantStore.getState()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  if (tenantId) {
    config.headers.set('X-Tenant-ID', tenantId)
  }

  return config
})

function isPaginatedEnvelope(body: unknown): body is PaginatedResponse<unknown> {
  if (typeof body !== 'object' || body === null || !('meta' in body)) {
    return false
  }
  const meta = (body as { meta: unknown }).meta
  return typeof meta === 'object' && meta !== null && 'current_page' in meta
}

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as unknown
    if (typeof body === 'object' && body !== null && 'data' in body) {
      const envelope = body as { data: unknown; meta?: unknown; links?: unknown }
      // Recurso simples ({data, message, meta}) -> response.data vira so o
      // valor de "data". Lista paginada ({data, links, meta}) mantem meta e
      // links, so larga o "message" (sem uso nas queries).
      response.data = isPaginatedEnvelope(body)
        ? { data: envelope.data, meta: envelope.meta, links: envelope.links }
        : envelope.data
    }
    return response
  },
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status
    const body = error.response?.data

    if (status === 401) {
      useAuthStore.getState().logout()
      // Sem router ainda (Passo 8) - redirect duro por agora.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    if (status === 403) {
      if (body?.error?.code === 'PASSWORD_CHANGE_REQUIRED') {
        // O backend bloqueia todos os outros endpoints enquanto
        // must_change_password for verdadeiro — redirect duro, tal como
        // no 401, para não deixar a app presa a repetir o mesmo pedido.
        if (window.location.pathname !== '/trocar-password') {
          window.location.href = '/trocar-password'
        }
        return Promise.reject(error)
      }
      if (body?.error?.code === 'MODULE_NOT_ACTIVE') {
        // Modal de upgrade fica para o ModuleGuard (Passo 8); o toast
        // garante feedback imediato mesmo em acções fora de rotas guardadas.
        toast.error(`O módulo "${body.error.module}" não está activo no teu plano.`)
      } else {
        toast.error(body?.message ?? 'Não tens permissão para esta acção.')
      }
      return Promise.reject(error)
    }

    if (status === 422) {
      // Não trata aqui - shared/utils/mapApiErrors.ts mapeia isto para
      // setError() do React Hook Form no onError de cada mutation.
      return Promise.reject(error)
    }

    if (status !== undefined && status >= 500) {
      toast.error('Erro no servidor. Tenta novamente dentro de momentos.')
      console.error('[api] erro 5xx', error)
      return Promise.reject(error)
    }

    if (!error.response) {
      // Sem resposta = falha de rede (contexto de ligações instáveis em Angola).
      toast.error('Sem ligação ao servidor. Verifica a tua ligação à internet.')
    }

    return Promise.reject(error)
  },
)
