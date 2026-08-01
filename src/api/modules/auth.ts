import { apiClient } from '@/api/client'
import type { AuthUser } from '@/shared/stores/authStore'

export interface LoginPayload {
  email: string
  password: string
}

interface RawUserResource {
  id: string
  type: string
  attributes: {
    name: string
    email: string
    must_change_password: boolean
    roles: string[]
    permissions: string[]
    modulos_activos: string[]
  }
  created_at: string | null
  updated_at: string | null
}

interface RawLoginResponse {
  token: string
  must_change_password: boolean
  user: RawUserResource
}

export interface LoginResult {
  token: string
  user: AuthUser
  permissions: string[]
  mustChangePassword: boolean
  activeModules: string[]
}

/**
 * A resposta real segue o formato JsonResource/attributes documentado
 * em docs/api-contract.md (raiz do monorepo) — achata-se aqui para o
 * formato flat que o resto da app espera. Confirmado com um login real
 * contra a stack em execução: não há "tenant" nenhum na resposta do
 * login (o cliente já sabe o tenant, foi ele que o forneceu no
 * cabeçalho X-Tenant-ID — ver useLogin.ts).
 */
export interface ChangePasswordPayload {
  currentPassword: string
  password: string
  passwordConfirmation: string
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.post('/auth/change-password', {
    current_password: payload.currentPassword,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
  })
}

export interface ForgotPasswordPayload {
  email: string
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload)
}

export interface ResetPasswordPayload {
  token: string
  password: string
  passwordConfirmation: string
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await apiClient.post('/auth/reset-password', {
    token: payload.token,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
  })
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await apiClient.post<RawLoginResponse>('/auth/login', payload)
  const raw = response.data

  return {
    token: raw.token,
    mustChangePassword: raw.must_change_password,
    user: {
      id: raw.user.id,
      name: raw.user.attributes.name,
      email: raw.user.attributes.email,
    },
    permissions: raw.user.attributes.permissions,
    activeModules: raw.user.attributes.modulos_activos,
  }
}
