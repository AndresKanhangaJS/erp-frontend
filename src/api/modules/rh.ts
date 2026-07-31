import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'
import { parseMoney, type MoneyWire } from '@/shared/utils/parseMoney'

import type { DeactivateFuncionarioFormValues } from '../../modules/rh/schemas/deactivateFuncionarioSchema'
import type { FuncionarioFormValues } from '../../modules/rh/schemas/funcionarioSchema'
import type { ProcessarFolhaFormValues } from '../../modules/rh/schemas/processarFolhaSchema'
import type { FolhaSalarial, Funcionario, Vencimento } from '../../modules/rh/types'

/*
 * Envelope real do backend (docs/api-contract.md): cada recurso vem
 * como {id, type, attributes, created_at, updated_at} — ver
 * api/modules/faturacao.ts para o mesmo padrão de mapeamento.
 */

interface RawFuncionarioResource {
  id: string
  type: 'funcionario'
  attributes: {
    nome: string
    nif: string | null
    numero_seguranca_social: string | null
    cargo: string
    departamento: string | null
    data_admissao: string
    data_cessacao: string | null
    estado: string
    salario_base: MoneyWire | null
    subsidio_alimentacao: MoneyWire | null
    subsidio_transporte: MoneyWire | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapFuncionario(raw: RawFuncionarioResource): Funcionario {
  const attrs = raw.attributes
  return {
    id: raw.id,
    nome: attrs.nome,
    nif: attrs.nif,
    numeroSegurancaSocial: attrs.numero_seguranca_social,
    cargo: attrs.cargo,
    departamento: attrs.departamento,
    dataAdmissao: attrs.data_admissao,
    dataCessacao: attrs.data_cessacao,
    estado: attrs.estado as Funcionario['estado'],
    salarioBase: parseMoney(attrs.salario_base),
    subsidioAlimentacao: parseMoney(attrs.subsidio_alimentacao),
    subsidioTransporte: parseMoney(attrs.subsidio_transporte),
  }
}

export interface ListFuncionariosParams {
  page?: number
  perPage?: number
}

export async function listFuncionarios(
  params: ListFuncionariosParams = {},
): Promise<PaginatedResponse<Funcionario>> {
  const response = await apiClient.get<PaginatedResponse<RawFuncionarioResource>>(
    '/rh/funcionarios',
    { params: { page: params.page, per_page: params.perPage } },
  )
  return { ...response.data, data: response.data.data.map(mapFuncionario) }
}

export async function getFuncionario(id: string): Promise<Funcionario> {
  const response = await apiClient.get<RawFuncionarioResource>(`/rh/funcionarios/${id}`)
  return mapFuncionario(response.data)
}

export async function criarFuncionario(values: FuncionarioFormValues): Promise<Funcionario> {
  const response = await apiClient.post<RawFuncionarioResource>('/rh/funcionarios', {
    nome: values.nome,
    nif: values.nif,
    numero_seguranca_social: values.numeroSegurancaSocial,
    cargo: values.cargo,
    departamento: values.departamento,
    data_admissao: values.dataAdmissao,
    salario_base: values.salarioBase,
    subsidio_alimentacao: values.subsidioAlimentacao,
    subsidio_transporte: values.subsidioTransporte,
  })
  return mapFuncionario(response.data)
}

/** data_admissao não é editável (UpdateFuncionarioRequest não a aceita). */
export async function editarFuncionario(
  id: string,
  values: FuncionarioFormValues,
): Promise<Funcionario> {
  const response = await apiClient.put<RawFuncionarioResource>(`/rh/funcionarios/${id}`, {
    nome: values.nome,
    nif: values.nif,
    numero_seguranca_social: values.numeroSegurancaSocial,
    cargo: values.cargo,
    departamento: values.departamento,
    salario_base: values.salarioBase,
    subsidio_alimentacao: values.subsidioAlimentacao,
    subsidio_transporte: values.subsidioTransporte,
  })
  return mapFuncionario(response.data)
}

/** Nunca é um destroy real — só desactiva (estado + data de cessação), mantém o histórico de vencimentos íntegro. */
export async function desactivarFuncionario(
  id: string,
  values: DeactivateFuncionarioFormValues,
): Promise<void> {
  await apiClient.delete(`/rh/funcionarios/${id}`, {
    params: { motivo: values.motivo, data_cessacao: values.dataCessacao },
  })
}

interface RawFolhaSalarialResource {
  id: string
  type: 'folha_salarial'
  attributes: {
    ano_fiscal: number
    mes: number
    estado: string
    data_processamento: string
  }
  created_at: string | null
  updated_at: string | null
}

function mapFolhaSalarial(raw: RawFolhaSalarialResource): FolhaSalarial {
  const attrs = raw.attributes
  return {
    id: raw.id,
    anoFiscal: attrs.ano_fiscal,
    mes: attrs.mes,
    estado: attrs.estado as FolhaSalarial['estado'],
    dataProcessamento: attrs.data_processamento,
  }
}

export interface ListFolhasParams {
  page?: number
  perPage?: number
}

export async function listFolhas(
  params: ListFolhasParams = {},
): Promise<PaginatedResponse<FolhaSalarial>> {
  const response = await apiClient.get<PaginatedResponse<RawFolhaSalarialResource>>(
    '/rh/folhas-salariais',
    { params: { page: params.page, per_page: params.perPage } },
  )
  return { ...response.data, data: response.data.data.map(mapFolhaSalarial) }
}

export async function getFolha(id: string): Promise<FolhaSalarial> {
  const response = await apiClient.get<RawFolhaSalarialResource>(`/rh/folhas-salariais/${id}`)
  return mapFolhaSalarial(response.data)
}

export async function processarFolha(values: ProcessarFolhaFormValues): Promise<FolhaSalarial> {
  const response = await apiClient.post<RawFolhaSalarialResource>('/rh/folhas-salariais', {
    ano_fiscal: values.anoFiscal,
    mes: values.mes,
  })
  return mapFolhaSalarial(response.data)
}

export async function anularFolha(id: string): Promise<FolhaSalarial> {
  const response = await apiClient.post<RawFolhaSalarialResource>(
    `/rh/folhas-salariais/${id}/anular`,
  )
  return mapFolhaSalarial(response.data)
}

interface RawVencimentoResource {
  id: string
  type: 'vencimento'
  attributes: {
    folha_id: string
    funcionario_id: string
    salario_base: MoneyWire | null
    subsidio_alimentacao: MoneyWire | null
    subsidio_transporte: MoneyWire | null
    vencimento_bruto: MoneyWire | null
    base_tributavel_irt: MoneyWire | null
    irt: MoneyWire | null
    inss_trabalhador: MoneyWire | null
    inss_empregador: MoneyWire | null
    vencimento_liquido: MoneyWire | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapVencimento(raw: RawVencimentoResource): Vencimento {
  const attrs = raw.attributes
  return {
    id: raw.id,
    folhaId: attrs.folha_id,
    funcionarioId: attrs.funcionario_id,
    salarioBase: parseMoney(attrs.salario_base),
    subsidioAlimentacao: parseMoney(attrs.subsidio_alimentacao),
    subsidioTransporte: parseMoney(attrs.subsidio_transporte),
    vencimentoBruto: parseMoney(attrs.vencimento_bruto),
    baseTributavelIrt: parseMoney(attrs.base_tributavel_irt),
    irt: parseMoney(attrs.irt),
    inssTrabalhador: parseMoney(attrs.inss_trabalhador),
    inssEmpregador: parseMoney(attrs.inss_empregador),
    vencimentoLiquido: parseMoney(attrs.vencimento_liquido),
  }
}

export async function listVencimentosDaFolha(folhaId: string): Promise<Vencimento[]> {
  const response = await apiClient.get<PaginatedResponse<RawVencimentoResource>>(
    `/rh/folhas-salariais/${folhaId}/vencimentos`,
  )
  return response.data.data.map(mapVencimento)
}

export async function getVencimento(id: string): Promise<Vencimento> {
  const response = await apiClient.get<RawVencimentoResource>(`/rh/vencimentos/${id}`)
  return mapVencimento(response.data)
}

export type ReciboResult = { pronto: true; url: string } | { pronto: false }

/** A geração do recibo é assíncrona (Job) — 202 enquanto não está pronto, 200 com URL assinada quando está. */
export async function getReciboVencimento(id: string): Promise<ReciboResult> {
  const response = await apiClient.get<{ url: string } | { message: string; code: string }>(
    `/rh/vencimentos/${id}/recibo`,
  )
  if (response.status === 202) {
    return { pronto: false }
  }
  return { pronto: true, url: (response.data as { url: string }).url }
}
