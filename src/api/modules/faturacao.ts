import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'

import type { EmitirFaturaFormValues } from '../../modules/faturacao/schemas/emitirFaturaSchema'
import type { Artigo, Cliente, DocumentoFiscal } from '../../modules/faturacao/types'

export interface ListDocumentosParams {
  page?: number
  perPage?: number
  search?: string
  estado?: string
}

export async function listDocumentos(
  params: ListDocumentosParams = {},
): Promise<PaginatedResponse<DocumentoFiscal>> {
  const response = await apiClient.get<PaginatedResponse<DocumentoFiscal>>(
    '/faturacao/documentos',
    {
      params: {
        page: params.page,
        per_page: params.perPage,
        search: params.search,
        estado: params.estado,
      },
    },
  )
  return response.data
}

export async function getDocumento(id: string): Promise<DocumentoFiscal> {
  const response = await apiClient.get<DocumentoFiscal>(`/faturacao/documentos/${id}`)
  return response.data
}

export async function emitirFatura(payload: EmitirFaturaFormValues): Promise<DocumentoFiscal> {
  const response = await apiClient.post<DocumentoFiscal>('/faturacao/documentos', payload)
  return response.data
}

export async function anularFatura(id: string): Promise<DocumentoFiscal> {
  const response = await apiClient.post<DocumentoFiscal>(`/faturacao/documentos/${id}/anular`)
  return response.data
}

export interface ListClientesParams {
  page?: number
  perPage?: number
  search?: string
}

export async function listClientes(
  params: ListClientesParams = {},
): Promise<PaginatedResponse<Cliente>> {
  const response = await apiClient.get<PaginatedResponse<Cliente>>('/faturacao/clientes', {
    params: { page: params.page, per_page: params.perPage, search: params.search },
  })
  return response.data
}

export interface ListArtigosParams {
  page?: number
  perPage?: number
  search?: string
}

export async function listArtigos(
  params: ListArtigosParams = {},
): Promise<PaginatedResponse<Artigo>> {
  const response = await apiClient.get<PaginatedResponse<Artigo>>('/faturacao/artigos', {
    params: { page: params.page, per_page: params.perPage, search: params.search },
  })
  return response.data
}

export interface SerieDocumento {
  id: string
  serie: string
  tipo: string
  proximoNumero: number
}

export async function listSeries(): Promise<SerieDocumento[]> {
  const response = await apiClient.get<PaginatedResponse<SerieDocumento>>('/faturacao/series')
  return response.data.data
}
