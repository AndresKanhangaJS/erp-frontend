import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'

import type { LancamentoFormValues } from '../../modules/contabilidade/schemas/lancamentoSchema'
import type { ContaFormValues } from '../../modules/contabilidade/schemas/contaSchema'
import type {
  Balanco,
  Conta,
  DemonstracaoResultados,
  Lancamento,
  Periodo,
  SaldoConta,
} from '../../modules/contabilidade/types'

export interface ListLancamentosParams {
  page?: number
  perPage?: number
  periodoId?: string
  estado?: string
}

export async function listLancamentos(
  params: ListLancamentosParams = {},
): Promise<PaginatedResponse<Lancamento>> {
  const response = await apiClient.get<PaginatedResponse<Lancamento>>(
    '/contabilidade/lancamentos',
    {
      params: {
        page: params.page,
        per_page: params.perPage,
        periodo_id: params.periodoId,
        estado: params.estado,
      },
    },
  )
  return response.data
}

export async function getLancamento(id: string): Promise<Lancamento> {
  const response = await apiClient.get<Lancamento>(`/contabilidade/lancamentos/${id}`)
  return response.data
}

export async function criarLancamento(payload: LancamentoFormValues): Promise<Lancamento> {
  const response = await apiClient.post<Lancamento>('/contabilidade/lancamentos', payload)
  return response.data
}

export interface AnularLancamentoResult {
  /** O lançamento original, agora em estado 'anulado' — nunca apagado nem escondido. */
  original: Lancamento
  /** Contra-entrada gerada pelo backend para reverter o efeito contabilístico do original. */
  estorno: Lancamento
}

export async function anularLancamento(id: string): Promise<AnularLancamentoResult> {
  const response = await apiClient.post<AnularLancamentoResult>(
    `/contabilidade/lancamentos/${id}/anular`,
  )
  return response.data
}

export interface ListContasParams {
  page?: number
  perPage?: number
  search?: string
}

export async function listContas(params: ListContasParams = {}): Promise<PaginatedResponse<Conta>> {
  const response = await apiClient.get<PaginatedResponse<Conta>>('/contabilidade/plano-de-contas', {
    params: { page: params.page, per_page: params.perPage, search: params.search },
  })
  return response.data
}

export async function createConta(payload: ContaFormValues): Promise<Conta> {
  const response = await apiClient.post<Conta>('/contabilidade/plano-de-contas', payload)
  return response.data
}

export async function updateConta(id: string, payload: ContaFormValues): Promise<Conta> {
  const response = await apiClient.put<Conta>(`/contabilidade/plano-de-contas/${id}`, payload)
  return response.data
}

export async function listPeriodos(): Promise<Periodo[]> {
  const response = await apiClient.get<PaginatedResponse<Periodo>>('/contabilidade/periodos')
  return response.data.data
}

export async function fecharPeriodo(id: string): Promise<Periodo> {
  const response = await apiClient.post<Periodo>(`/contabilidade/periodos/${id}/fechar`)
  return response.data
}

export async function getBalancete(periodoId: string): Promise<SaldoConta[]> {
  const response = await apiClient.get<SaldoConta[]>('/contabilidade/balancete', {
    params: { periodo_id: periodoId },
  })
  return response.data
}

export async function getBalanco(periodoId: string): Promise<Balanco> {
  const response = await apiClient.get<Balanco>('/contabilidade/balanco', {
    params: { periodo_id: periodoId },
  })
  return response.data
}

export async function getDemonstracaoResultados(
  periodoId: string,
): Promise<DemonstracaoResultados> {
  const response = await apiClient.get<DemonstracaoResultados>(
    '/contabilidade/demonstracao-resultados',
    { params: { periodo_id: periodoId } },
  )
  return response.data
}
