import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'

import type { DesactivarUtilizadorFormValues } from '../../modules/admin/schemas/desactivarUtilizadorSchema'
import type { UtilizadorFormValues } from '../../modules/admin/schemas/utilizadorSchema'
import type { Utilizador } from '../../modules/admin/types'

/*
 * Envelope real do backend (docs/api-contract.md): cada recurso vem
 * como {id, type, attributes, created_at, updated_at} — ver
 * api/modules/faturacao.ts para o mesmo padrão de mapeamento.
 */

interface RawUtilizadorResource {
  id: string
  type: 'user'
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

function mapUtilizador(raw: RawUtilizadorResource): Utilizador {
  const attrs = raw.attributes
  return {
    id: raw.id,
    nome: attrs.name,
    email: attrs.email,
    mustChangePassword: attrs.must_change_password,
    roles: attrs.roles,
    permissions: attrs.permissions,
  }
}

export interface ListUtilizadoresParams {
  page?: number
  perPage?: number
}

export async function listUtilizadores(
  params: ListUtilizadoresParams = {},
): Promise<PaginatedResponse<Utilizador>> {
  const response = await apiClient.get<PaginatedResponse<RawUtilizadorResource>>('/admin/users', {
    params: { page: params.page, per_page: params.perPage },
  })
  return { ...response.data, data: response.data.data.map(mapUtilizador) }
}

export async function getUtilizador(id: string): Promise<Utilizador> {
  const response = await apiClient.get<RawUtilizadorResource>(`/admin/users/${id}`)
  return mapUtilizador(response.data)
}

export interface CriarUtilizadorResult {
  utilizador: Utilizador
  temporaryPassword: string
}

/** must_change_password é sempre forçado a true pelo backend — nunca é input. */
export async function criarUtilizador(
  values: UtilizadorFormValues,
): Promise<CriarUtilizadorResult> {
  const response = await apiClient.post<{
    user: RawUtilizadorResource
    temporary_password: string
  }>('/admin/users', { name: values.nome, email: values.email, role: values.role })
  return {
    utilizador: mapUtilizador(response.data.user),
    temporaryPassword: response.data.temporary_password,
  }
}

export async function editarUtilizador(
  id: string,
  values: UtilizadorFormValues,
): Promise<Utilizador> {
  const response = await apiClient.put<RawUtilizadorResource>(`/admin/users/${id}`, {
    name: values.nome,
    email: values.email,
    role: values.role,
  })
  return mapUtilizador(response.data)
}

/** Nunca é reversível: desactiva o utilizador (soft-delete com motivo) e revoga as sessões activas dele. */
export async function desactivarUtilizador(
  id: string,
  values: DesactivarUtilizadorFormValues,
): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`, { params: { reason: values.reason } })
}

/** Gera uma nova senha temporária, força troca no próximo acesso e revoga as sessões activas do utilizador. */
export async function resetPasswordUtilizador(id: string): Promise<string> {
  const response = await apiClient.post<{ temporary_password: string }>(
    `/admin/users/${id}/reset-password`,
  )
  return response.data.temporary_password
}
