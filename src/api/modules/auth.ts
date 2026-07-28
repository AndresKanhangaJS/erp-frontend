import { apiClient } from '@/api/client'
import type { AuthUser } from '@/shared/stores/authStore'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
  permissions: string[]
  tenant: {
    id: string
    plan: string
    active_modules: string[]
  }
}

/**
 * Endpoint e forma da resposta são uma suposição razoável — o backend
 * ainda não publicou o OpenAPI (../docs/openapi.json não existe).
 * Confirmar/ajustar contra o contrato real assim que existir.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload)
  return response.data
}
