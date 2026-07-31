import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'
import { parseMoney, type MoneyWire } from '@/shared/utils/parseMoney'

import type { ArmazemFormValues } from '../../modules/stock/schemas/armazemSchema'
import type { InventarioFormValues } from '../../modules/stock/schemas/inventarioSchema'
import type { MovimentoFormValues } from '../../modules/stock/schemas/movimentoSchema'
import type { TransferenciaFormValues } from '../../modules/stock/schemas/transferenciaSchema'
import type {
  Armazem,
  EstadoInventario,
  Existencia,
  Inventario,
  InventarioLinha,
  MovimentoStock,
  TipoMovimentoStock,
} from '../../modules/stock/types'

/*
 * Envelope real do backend (docs/api-contract.md): cada recurso vem
 * como {id, type, attributes, created_at, updated_at} — ver
 * api/modules/faturacao.ts para o mesmo padrão de mapeamento.
 */

interface RawArmazemResource {
  id: string
  type: 'armazem'
  attributes: {
    codigo: string
    nome: string
    endereco: string | null
    is_padrao: boolean
  }
  created_at: string | null
  updated_at: string | null
}

function mapArmazem(raw: RawArmazemResource): Armazem {
  const attrs = raw.attributes
  return {
    id: raw.id,
    codigo: attrs.codigo,
    nome: attrs.nome,
    endereco: attrs.endereco,
    isPadrao: attrs.is_padrao,
  }
}

export async function listArmazens(): Promise<Armazem[]> {
  const response = await apiClient.get<PaginatedResponse<RawArmazemResource>>('/stock/armazens')
  return response.data.data.map(mapArmazem)
}

export async function getArmazem(id: string): Promise<Armazem> {
  const response = await apiClient.get<RawArmazemResource>(`/stock/armazens/${id}`)
  return mapArmazem(response.data)
}

export async function criarArmazem(values: ArmazemFormValues): Promise<Armazem> {
  const response = await apiClient.post<RawArmazemResource>('/stock/armazens', {
    codigo: values.codigo,
    nome: values.nome,
    endereco: values.endereco,
  })
  return mapArmazem(response.data)
}

interface RawExistenciaResource {
  id: string
  type: 'existencia'
  attributes: {
    armazem_id: string
    artigo_id: string
    quantidade: string
    custo_medio: MoneyWire | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapExistencia(raw: RawExistenciaResource): Existencia {
  const attrs = raw.attributes
  return {
    armazemId: attrs.armazem_id,
    artigoId: attrs.artigo_id,
    quantidade: Number(attrs.quantidade),
    custoMedio: parseMoney(attrs.custo_medio),
  }
}

export interface ListExistenciasParams {
  page?: number
  perPage?: number
  armazemId?: string
  artigoId?: string
}

export async function listExistencias(
  params: ListExistenciasParams = {},
): Promise<PaginatedResponse<Existencia>> {
  const response = await apiClient.get<PaginatedResponse<RawExistenciaResource>>(
    '/stock/existencias',
    {
      params: {
        page: params.page,
        per_page: params.perPage,
        armazem_id: params.armazemId,
        artigo_id: params.artigoId,
      },
    },
  )
  return { ...response.data, data: response.data.data.map(mapExistencia) }
}

interface RawMovimentoStockResource {
  id: string
  type: 'movimento_stock'
  attributes: {
    armazem_id: string
    artigo_id: string
    artigo_codigo: string
    artigo_nome: string
    tipo: TipoMovimentoStock
    quantidade: string
    custo_unitario: MoneyWire | null
    data: string | null
    origem_tipo: string | null
    origem_id: string | null
    observacoes: string | null
    movimento_estorno_id: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapMovimento(raw: RawMovimentoStockResource): MovimentoStock {
  const attrs = raw.attributes
  return {
    id: raw.id,
    armazemId: attrs.armazem_id,
    artigoId: attrs.artigo_id,
    artigoCodigo: attrs.artigo_codigo,
    artigoNome: attrs.artigo_nome,
    tipo: attrs.tipo,
    quantidade: Number(attrs.quantidade),
    custoUnitario: parseMoney(attrs.custo_unitario),
    data: attrs.data,
    origemTipo: attrs.origem_tipo,
    origemId: attrs.origem_id,
    observacoes: attrs.observacoes,
    movimentoEstornoId: attrs.movimento_estorno_id,
  }
}

export interface ListMovimentosParams {
  page?: number
  perPage?: number
  armazemId?: string
  artigoId?: string
}

export async function listMovimentos(
  params: ListMovimentosParams = {},
): Promise<PaginatedResponse<MovimentoStock>> {
  const response = await apiClient.get<PaginatedResponse<RawMovimentoStockResource>>(
    '/stock/movimentos',
    {
      params: {
        page: params.page,
        per_page: params.perPage,
        armazem_id: params.armazemId,
        artigo_id: params.artigoId,
      },
    },
  )
  return { ...response.data, data: response.data.data.map(mapMovimento) }
}

export async function getMovimento(id: string): Promise<MovimentoStock> {
  const response = await apiClient.get<RawMovimentoStockResource>(`/stock/movimentos/${id}`)
  return mapMovimento(response.data)
}

export async function registarMovimento(values: MovimentoFormValues): Promise<MovimentoStock> {
  const response = await apiClient.post<RawMovimentoStockResource>('/stock/movimentos', {
    armazem_id: values.armazemId,
    artigo_id: values.artigoId,
    tipo: values.tipo,
    quantidade: values.quantidade,
    custo_unitario: values.custoUnitario,
    observacoes: values.observacoes,
  })
  return mapMovimento(response.data)
}

export async function estornarMovimento(id: string): Promise<MovimentoStock> {
  const response = await apiClient.post<RawMovimentoStockResource>(
    `/stock/movimentos/${id}/estornar`,
  )
  return mapMovimento(response.data)
}

export interface TransferenciaResult {
  saida: MovimentoStock
  entrada: MovimentoStock
}

export async function transferirStock(
  values: TransferenciaFormValues,
): Promise<TransferenciaResult> {
  const response = await apiClient.post<{
    saida: RawMovimentoStockResource
    entrada: RawMovimentoStockResource
  }>('/stock/movimentos/transferir', {
    armazem_origem_id: values.armazemOrigemId,
    armazem_destino_id: values.armazemDestinoId,
    artigo_id: values.artigoId,
    quantidade: values.quantidade,
    observacoes: values.observacoes,
  })
  return { saida: mapMovimento(response.data.saida), entrada: mapMovimento(response.data.entrada) }
}

interface RawInventarioLinha {
  id: string
  artigo_id: string
  artigo_codigo: string
  artigo_nome: string
  quantidade_sistema: string
  quantidade_contada: string
}

interface RawInventarioResource {
  id: string
  type: 'inventario'
  attributes: {
    armazem_id: string
    estado: EstadoInventario
    data: string | null
    observacoes: string | null
    linhas: RawInventarioLinha[] | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapInventarioLinha(raw: RawInventarioLinha): InventarioLinha {
  return {
    id: raw.id,
    artigoId: raw.artigo_id,
    artigoCodigo: raw.artigo_codigo,
    artigoNome: raw.artigo_nome,
    quantidadeSistema: Number(raw.quantidade_sistema),
    quantidadeContada: Number(raw.quantidade_contada),
  }
}

function mapInventario(raw: RawInventarioResource): Inventario {
  const attrs = raw.attributes
  return {
    id: raw.id,
    armazemId: attrs.armazem_id,
    estado: attrs.estado,
    data: attrs.data,
    observacoes: attrs.observacoes,
    linhas: attrs.linhas ? attrs.linhas.map(mapInventarioLinha) : null,
  }
}

export interface ListInventariosParams {
  page?: number
  perPage?: number
}

export async function listInventarios(
  params: ListInventariosParams = {},
): Promise<PaginatedResponse<Inventario>> {
  const response = await apiClient.get<PaginatedResponse<RawInventarioResource>>(
    '/stock/inventarios',
    { params: { page: params.page, per_page: params.perPage } },
  )
  return { ...response.data, data: response.data.data.map(mapInventario) }
}

export async function getInventario(id: string): Promise<Inventario> {
  const response = await apiClient.get<RawInventarioResource>(`/stock/inventarios/${id}`)
  return mapInventario(response.data)
}

export async function criarInventario(values: InventarioFormValues): Promise<Inventario> {
  const response = await apiClient.post<RawInventarioResource>('/stock/inventarios', {
    armazem_id: values.armazemId,
    observacoes: values.observacoes,
    linhas: values.linhas.map((linha) => ({
      artigo_id: linha.artigoId,
      quantidade_contada: linha.quantidadeContada,
    })),
  })
  return mapInventario(response.data)
}

export async function fecharInventario(id: string): Promise<Inventario> {
  const response = await apiClient.post<RawInventarioResource>(`/stock/inventarios/${id}/fechar`)
  return mapInventario(response.data)
}
