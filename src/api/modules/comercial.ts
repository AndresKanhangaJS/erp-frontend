import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'
import { parseMoney, type MoneyWire } from '@/shared/utils/parseMoney'

import type { ActividadeFormValues } from '../../modules/comercial/schemas/actividadeSchema'
import type { LeadFormValues } from '../../modules/comercial/schemas/leadSchema'
import type { OportunidadeFormValues } from '../../modules/comercial/schemas/oportunidadeSchema'
import type { PipelineFormValues } from '../../modules/comercial/schemas/pipelineSchema'
import type {
  ActividadeCrm,
  EstadoLead,
  Lead,
  Oportunidade,
  OrigemLead,
  Pipeline,
  PipelineEstagio,
  RelacionadoTipo,
  TipoActividadeCrm,
  TipoEstagioPipeline,
} from '../../modules/comercial/types'

/*
 * Envelope real do backend (docs/api-contract.md): cada recurso vem
 * como {id, type, attributes, created_at, updated_at} — ver
 * api/modules/faturacao.ts para o mesmo padrão de mapeamento.
 */

interface RawLeadResource {
  id: string
  type: 'lead'
  attributes: {
    nome: string
    empresa: string | null
    email: string | null
    telefone: string | null
    origem: OrigemLead
    estado: EstadoLead
    faturacao_cliente_id: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapLead(raw: RawLeadResource): Lead {
  const attrs = raw.attributes
  return {
    id: raw.id,
    nome: attrs.nome,
    empresa: attrs.empresa,
    email: attrs.email,
    telefone: attrs.telefone,
    origem: attrs.origem,
    estado: attrs.estado,
    faturacaoClienteId: attrs.faturacao_cliente_id,
  }
}

export interface ListLeadsParams {
  page?: number
  perPage?: number
}

export async function listLeads(params: ListLeadsParams = {}): Promise<PaginatedResponse<Lead>> {
  const response = await apiClient.get<PaginatedResponse<RawLeadResource>>('/comercial/leads', {
    params: { page: params.page, per_page: params.perPage },
  })
  return { ...response.data, data: response.data.data.map(mapLead) }
}

export async function getLead(id: string): Promise<Lead> {
  const response = await apiClient.get<RawLeadResource>(`/comercial/leads/${id}`)
  return mapLead(response.data)
}

export async function criarLead(values: LeadFormValues): Promise<Lead> {
  const response = await apiClient.post<RawLeadResource>('/comercial/leads', {
    nome: values.nome,
    empresa: values.empresa,
    email: values.email,
    telefone: values.telefone,
    origem: values.origem,
  })
  return mapLead(response.data)
}

/** origem não é editável (UpdateLeadRequest não a aceita) — a edição troca origem por estado. */
export async function editarLead(id: string, values: LeadFormValues): Promise<Lead> {
  const response = await apiClient.put<RawLeadResource>(`/comercial/leads/${id}`, {
    nome: values.nome,
    empresa: values.empresa,
    email: values.email,
    telefone: values.telefone,
    estado: values.estado,
  })
  return mapLead(response.data)
}

interface RawPipelineEstagio {
  id: string
  nome: string
  ordem: number
  tipo: TipoEstagioPipeline
}

interface RawPipelineResource {
  id: string
  type: 'pipeline'
  attributes: {
    nome: string
    is_padrao: boolean
    estagios: RawPipelineEstagio[] | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapPipelineEstagio(raw: RawPipelineEstagio): PipelineEstagio {
  return { id: raw.id, nome: raw.nome, ordem: raw.ordem, tipo: raw.tipo }
}

function mapPipeline(raw: RawPipelineResource): Pipeline {
  const attrs = raw.attributes
  return {
    id: raw.id,
    nome: attrs.nome,
    isPadrao: attrs.is_padrao,
    estagios: (attrs.estagios ?? []).map(mapPipelineEstagio),
  }
}

export async function listPipelines(): Promise<Pipeline[]> {
  const response =
    await apiClient.get<PaginatedResponse<RawPipelineResource>>('/comercial/pipelines')
  return response.data.data.map(mapPipeline)
}

export async function getPipeline(id: string): Promise<Pipeline> {
  const response = await apiClient.get<RawPipelineResource>(`/comercial/pipelines/${id}`)
  return mapPipeline(response.data)
}

export async function criarPipeline(values: PipelineFormValues): Promise<Pipeline> {
  const response = await apiClient.post<RawPipelineResource>('/comercial/pipelines', {
    nome: values.nome,
    estagios: values.estagios.map((estagio) => ({ nome: estagio.nome, tipo: estagio.tipo })),
  })
  return mapPipeline(response.data)
}

interface RawOportunidadeResource {
  id: string
  type: 'oportunidade'
  attributes: {
    lead_id: string
    titulo: string
    valor_estimado: MoneyWire | null
    probabilidade: number
    pipeline_estagio_id: string
    data_fecho_prevista: string | null
    data_fechamento: string | null
    faturacao_cliente_id: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapOportunidade(raw: RawOportunidadeResource): Oportunidade {
  const attrs = raw.attributes
  return {
    id: raw.id,
    leadId: attrs.lead_id,
    titulo: attrs.titulo,
    valorEstimado: parseMoney(attrs.valor_estimado),
    probabilidade: attrs.probabilidade,
    pipelineEstagioId: attrs.pipeline_estagio_id,
    dataFechoPrevista: attrs.data_fecho_prevista,
    dataFechamento: attrs.data_fechamento,
    faturacaoClienteId: attrs.faturacao_cliente_id,
  }
}

export interface ListOportunidadesParams {
  page?: number
  perPage?: number
}

export async function listOportunidades(
  params: ListOportunidadesParams = {},
): Promise<PaginatedResponse<Oportunidade>> {
  const response = await apiClient.get<PaginatedResponse<RawOportunidadeResource>>(
    '/comercial/oportunidades',
    { params: { page: params.page, per_page: params.perPage } },
  )
  return { ...response.data, data: response.data.data.map(mapOportunidade) }
}

export async function getOportunidade(id: string): Promise<Oportunidade> {
  const response = await apiClient.get<RawOportunidadeResource>(`/comercial/oportunidades/${id}`)
  return mapOportunidade(response.data)
}

export async function criarOportunidade(values: OportunidadeFormValues): Promise<Oportunidade> {
  const response = await apiClient.post<RawOportunidadeResource>('/comercial/oportunidades', {
    lead_id: values.leadId,
    titulo: values.titulo,
    valor_estimado: values.valorEstimado,
    probabilidade: values.probabilidade,
    pipeline_estagio_id: values.pipelineEstagioId,
    data_fecho_prevista: values.dataFechoPrevista,
  })
  return mapOportunidade(response.data)
}

export async function moverEstagioOportunidade(
  id: string,
  pipelineEstagioId: string,
): Promise<Oportunidade> {
  const response = await apiClient.post<RawOportunidadeResource>(
    `/comercial/oportunidades/${id}/mover-estagio`,
    { pipeline_estagio_id: pipelineEstagioId },
  )
  return mapOportunidade(response.data)
}

interface RawActividadeCrmResource {
  id: string
  type: 'actividade_crm'
  attributes: {
    tipo: TipoActividadeCrm
    descricao: string
    data: string | null
    /** Nome de classe PHP completo (relação polimórfica) — não 'lead'/'oportunidade' directamente. */
    relacionado_type: string
    relacionado_id: string
  }
  created_at: string | null
  updated_at: string | null
}

function mapRelacionadoTipo(relacionadoType: string): RelacionadoTipo {
  return relacionadoType.endsWith('\\Lead') ? 'lead' : 'oportunidade'
}

function mapActividade(raw: RawActividadeCrmResource): ActividadeCrm {
  const attrs = raw.attributes
  return {
    id: raw.id,
    tipo: attrs.tipo,
    descricao: attrs.descricao,
    data: attrs.data ?? '',
    relacionadoTipo: mapRelacionadoTipo(attrs.relacionado_type),
    relacionadoId: attrs.relacionado_id,
  }
}

export async function listActividades(
  relacionadoTipo: RelacionadoTipo,
  relacionadoId: string,
): Promise<ActividadeCrm[]> {
  const response = await apiClient.get<PaginatedResponse<RawActividadeCrmResource>>(
    '/comercial/actividades',
    { params: { relacionado_tipo: relacionadoTipo, relacionado_id: relacionadoId } },
  )
  return response.data.data.map(mapActividade)
}

export async function registarActividade(values: ActividadeFormValues): Promise<ActividadeCrm> {
  const response = await apiClient.post<RawActividadeCrmResource>('/comercial/actividades', {
    tipo: values.tipo,
    descricao: values.descricao,
    data: values.data,
    relacionado_tipo: values.relacionadoTipo,
    relacionado_id: values.relacionadoId,
  })
  return mapActividade(response.data)
}
