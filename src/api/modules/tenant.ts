import { apiClient } from '@/api/client'
import type { AuthUser } from '@/shared/stores/authStore'

export interface RegisterTenantPayload {
  nomeEmpresa: string
  nif: string | null
  adminNome: string
  adminEmail: string
  adminPassword: string
  adminPasswordConfirmation: string
  plano: 'starter' | 'growth' | 'pro'
}

interface RawRegisterTenantResponse {
  token: string
  must_change_password: boolean
  tenant: { id: string; slug: string }
  user: {
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
}

export interface RegisterTenantResult {
  token: string
  tenantId: string
  tenantSlug: string
  user: AuthUser
  permissions: string[]
  activeModules: string[]
}

/**
 * Sem tenant nenhum ainda — é este pedido que o cria (ver
 * app/Modules/Core/Tenant/routes.php, erp-api: fora do middleware
 * "tenant" de propósito). O token devolvido já serve para entrar
 * directamente, sem precisar de login a seguir.
 */
export async function registerTenant(
  payload: RegisterTenantPayload,
): Promise<RegisterTenantResult> {
  const response = await apiClient.post<RawRegisterTenantResponse>('/tenants/register', {
    nome_empresa: payload.nomeEmpresa,
    nif: payload.nif,
    admin_nome: payload.adminNome,
    admin_email: payload.adminEmail,
    admin_password: payload.adminPassword,
    admin_password_confirmation: payload.adminPasswordConfirmation,
    plano: payload.plano,
  })
  const raw = response.data

  return {
    token: raw.token,
    tenantId: raw.tenant.id,
    tenantSlug: raw.tenant.slug,
    user: {
      id: raw.user.id,
      name: raw.user.attributes.name,
      email: raw.user.attributes.email,
    },
    permissions: raw.user.attributes.permissions,
    activeModules: raw.user.attributes.modulos_activos,
  }
}
