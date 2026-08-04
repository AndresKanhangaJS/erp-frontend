import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'
import { parseMoney, type MoneyWire } from '@/shared/utils/parseMoney'

import type { ApurarIvaFormValues } from '../../modules/contabilidade/schemas/apuramentoIvaSchema'
import type { ContaFormValues } from '../../modules/contabilidade/schemas/contaSchema'
import type { LancamentoFormValues } from '../../modules/contabilidade/schemas/lancamentoSchema'
import type { PeriodoFormValues } from '../../modules/contabilidade/schemas/periodoSchema'
import type {
  ApuramentoIva,
  Balanco,
  Conta,
  DemonstracaoResultados,
  Lancamento,
  LinhaDemonstrativo,
  Periodo,
  SaldoConta,
  TipoConta,
  TipoOrigemLancamento,
} from '../../modules/contabilidade/types'

/*
 * Envelope real do backend (docs/api-contract.md): cada recurso vem
 * como {id, type, attributes, created_at, updated_at} — o interceptor
 * de resposta (api/client.ts) já desembrulha o "{data: ...}" externo,
 * mas o achatamento de "attributes" para um objecto de domínio plano é
 * feito aqui, módulo a módulo (ver api/modules/faturacao.ts para o
 * mesmo padrão). Dinheiro nunca vem como número — vem sempre
 * {amount,currency} (aqui sempre AOA — Contabilidade não é multi-moeda).
 */

interface RawContaResource {
  id: string
  type: 'conta'
  attributes: {
    codigo: string
    designacao: string
    tipo: TipoConta
    conta_pai_id: string | null
    permite_lancamentos: boolean
  }
  created_at: string | null
  updated_at: string | null
}

function mapConta(raw: RawContaResource): Conta {
  const attrs = raw.attributes
  return {
    id: raw.id,
    codigo: attrs.codigo,
    designacao: attrs.designacao,
    tipo: attrs.tipo,
    contaPaiId: attrs.conta_pai_id,
    permiteLancamentos: attrs.permite_lancamentos,
  }
}

export interface ListContasParams {
  page?: number
  perPage?: number
  search?: string
}

export async function listContas(params: ListContasParams = {}): Promise<PaginatedResponse<Conta>> {
  const response = await apiClient.get<PaginatedResponse<RawContaResource>>(
    '/contabilidade/plano-de-contas',
    { params: { page: params.page, per_page: params.perPage, search: params.search } },
  )
  return { ...response.data, data: response.data.data.map(mapConta) }
}

export async function criarConta(values: ContaFormValues): Promise<Conta> {
  const response = await apiClient.post<RawContaResource>('/contabilidade/plano-de-contas', {
    codigo: values.codigo,
    designacao: values.designacao,
    tipo: values.tipo,
    conta_pai_id: values.contaPaiId,
    permite_lancamentos: values.permiteLancamentos,
  })
  return mapConta(response.data)
}

/** codigo e tipo não são editáveis (UpdateContaRequest não os aceita) — só designacao/contaPaiId/permiteLancamentos. */
export async function editarConta(
  id: string,
  values: Pick<ContaFormValues, 'designacao' | 'contaPaiId' | 'permiteLancamentos'>,
): Promise<Conta> {
  const response = await apiClient.put<RawContaResource>(`/contabilidade/plano-de-contas/${id}`, {
    designacao: values.designacao,
    conta_pai_id: values.contaPaiId,
    permite_lancamentos: values.permiteLancamentos,
  })
  return mapConta(response.data)
}

interface RawLinhaLancamento {
  id: string
  conta_id: string
  debito: MoneyWire | null
  credito: MoneyWire | null
}

interface RawLancamentoResource {
  id: string
  type: 'lancamento'
  attributes: {
    numero: string | number
    periodo_id: string
    data: string | null
    descricao: string
    estado: string
    tipo_origem: TipoOrigemLancamento
    origem_tipo: string | null
    origem_id: string | null
    lancamento_estorno_id: string | null
    linhas: RawLinhaLancamento[] | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapLancamento(raw: RawLancamentoResource): Lancamento {
  const attrs = raw.attributes
  return {
    id: raw.id,
    numero: String(attrs.numero),
    data: attrs.data ?? '',
    descricao: attrs.descricao,
    periodoId: attrs.periodo_id,
    estado: attrs.estado as Lancamento['estado'],
    tipoOrigem: attrs.tipo_origem,
    origemTipo: attrs.origem_tipo,
    origemId: attrs.origem_id,
    lancamentoEstornoId: attrs.lancamento_estorno_id,
    linhas: (attrs.linhas ?? []).map((linha) => ({
      contaId: linha.conta_id,
      debito: parseMoney(linha.debito),
      credito: parseMoney(linha.credito),
    })),
    createdAt: raw.created_at,
  }
}

export interface ListLancamentosParams {
  page?: number
  perPage?: number
  periodoId?: string
  estado?: string
}

export async function listLancamentos(
  params: ListLancamentosParams = {},
): Promise<PaginatedResponse<Lancamento>> {
  const response = await apiClient.get<PaginatedResponse<RawLancamentoResource>>(
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
  return { ...response.data, data: response.data.data.map(mapLancamento) }
}

export async function getLancamento(id: string): Promise<Lancamento> {
  const response = await apiClient.get<RawLancamentoResource>(`/contabilidade/lancamentos/${id}`)
  return mapLancamento(response.data)
}

export async function criarLancamento(values: LancamentoFormValues): Promise<Lancamento> {
  const response = await apiClient.post<RawLancamentoResource>('/contabilidade/lancamentos', {
    periodo_id: values.periodoId,
    data: values.data,
    descricao: values.descricao,
    linhas: values.linhas.map((linha) => ({
      conta_id: linha.contaId,
      debito: linha.debito > 0 ? linha.debito : null,
      credito: linha.credito > 0 ? linha.credito : null,
    })),
  })
  return mapLancamento(response.data)
}

export interface AnularLancamentoResult {
  /** O lançamento original, agora em estado 'anulado' — nunca apagado nem escondido. */
  original: Lancamento
  /** Contra-entrada gerada pelo backend para reverter o efeito contabilístico do original. */
  estorno: Lancamento
}

export async function anularLancamento(id: string): Promise<AnularLancamentoResult> {
  const response = await apiClient.post<{
    original: RawLancamentoResource
    estorno: RawLancamentoResource
  }>(`/contabilidade/lancamentos/${id}/anular`)
  return {
    original: mapLancamento(response.data.original),
    estorno: mapLancamento(response.data.estorno),
  }
}

interface RawPeriodoResource {
  id: string
  type: 'periodo_contabil'
  attributes: {
    ano_fiscal: string | number
    mes: string | number
    fechado: boolean
    fechado_em: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapPeriodo(raw: RawPeriodoResource): Periodo {
  const attrs = raw.attributes
  return {
    id: raw.id,
    anoFiscal: Number(attrs.ano_fiscal),
    mes: Number(attrs.mes),
    fechado: attrs.fechado,
    fechadoEm: attrs.fechado_em,
  }
}

export async function listPeriodos(): Promise<Periodo[]> {
  const response =
    await apiClient.get<PaginatedResponse<RawPeriodoResource>>('/contabilidade/periodos')
  return response.data.data.map(mapPeriodo)
}

export async function criarPeriodo(values: PeriodoFormValues): Promise<Periodo> {
  const response = await apiClient.post<RawPeriodoResource>('/contabilidade/periodos', {
    ano_fiscal: values.anoFiscal,
    mes: values.mes,
  })
  return mapPeriodo(response.data)
}

export async function fecharPeriodo(id: string): Promise<Periodo> {
  const response = await apiClient.post<RawPeriodoResource>(`/contabilidade/periodos/${id}/fechar`)
  return mapPeriodo(response.data)
}

interface RawSaldoContaResource {
  conta_id: string
  conta_codigo: string
  conta_designacao: string
  saldo_anterior: MoneyWire | null
  debito: MoneyWire | null
  credito: MoneyWire | null
  saldo_atual: MoneyWire | null
}

function mapSaldoConta(raw: RawSaldoContaResource): SaldoConta {
  return {
    contaId: raw.conta_id,
    contaCodigo: raw.conta_codigo,
    contaDesignacao: raw.conta_designacao,
    saldoAnterior: parseMoney(raw.saldo_anterior),
    debito: parseMoney(raw.debito),
    credito: parseMoney(raw.credito),
    saldoAtual: parseMoney(raw.saldo_atual),
  }
}

export async function getBalancete(periodoId: string): Promise<SaldoConta[]> {
  const response = await apiClient.get<RawSaldoContaResource[]>('/contabilidade/balancete', {
    params: { periodo_id: periodoId },
  })
  return response.data.map(mapSaldoConta)
}

interface RawLinhaDemonstrativo {
  conta_id: string
  conta_codigo: string
  conta_designacao: string
  valor: MoneyWire | null
}

function mapLinhaDemonstrativo(raw: RawLinhaDemonstrativo): LinhaDemonstrativo {
  return {
    contaId: raw.conta_id,
    contaCodigo: raw.conta_codigo,
    contaDesignacao: raw.conta_designacao,
    valor: parseMoney(raw.valor),
  }
}

interface RawBalancoResource {
  activo: RawLinhaDemonstrativo[]
  passivo: RawLinhaDemonstrativo[]
  capital_proprio: RawLinhaDemonstrativo[]
  resultado_acumulado: MoneyWire | null
  total_activo: MoneyWire | null
  total_passivo: MoneyWire | null
  total_capital_proprio: MoneyWire | null
}

export async function getBalanco(periodoId: string): Promise<Balanco> {
  const response = await apiClient.get<RawBalancoResource>('/contabilidade/balanco', {
    params: { periodo_id: periodoId },
  })
  const raw = response.data
  return {
    activo: raw.activo.map(mapLinhaDemonstrativo),
    passivo: raw.passivo.map(mapLinhaDemonstrativo),
    capitalProprio: raw.capital_proprio.map(mapLinhaDemonstrativo),
    resultadoAcumulado: parseMoney(raw.resultado_acumulado),
    totalActivo: parseMoney(raw.total_activo),
    totalPassivo: parseMoney(raw.total_passivo),
    totalCapitalProprio: parseMoney(raw.total_capital_proprio),
  }
}

interface RawDemonstracaoResultadosResource {
  proveitos: RawLinhaDemonstrativo[]
  custos: RawLinhaDemonstrativo[]
  total_proveitos: MoneyWire | null
  total_custos: MoneyWire | null
  resultado_liquido: MoneyWire | null
}

export async function getDemonstracaoResultados(
  periodoId: string,
): Promise<DemonstracaoResultados> {
  const response = await apiClient.get<RawDemonstracaoResultadosResource>(
    '/contabilidade/demonstracao-resultados',
    { params: { periodo_id: periodoId } },
  )
  const raw = response.data
  return {
    proveitos: raw.proveitos.map(mapLinhaDemonstrativo),
    custos: raw.custos.map(mapLinhaDemonstrativo),
    totalProveitos: parseMoney(raw.total_proveitos),
    totalCustos: parseMoney(raw.total_custos),
    resultadoLiquido: parseMoney(raw.resultado_liquido),
  }
}

interface RawApuramentoIvaResource {
  id: string
  type: 'apuramento_iva'
  attributes: {
    periodo_id: string
    iva_liquidado: MoneyWire | null
    iva_dedutivel: MoneyWire | null
    iva_apurado: MoneyWire | null
    lancamento_id: string | null
    data_apuramento: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapApuramentoIva(raw: RawApuramentoIvaResource): ApuramentoIva {
  const attrs = raw.attributes
  return {
    id: raw.id,
    periodoId: attrs.periodo_id,
    ivaLiquidado: parseMoney(attrs.iva_liquidado),
    ivaDedutivel: parseMoney(attrs.iva_dedutivel),
    ivaApurado: parseMoney(attrs.iva_apurado),
    lancamentoId: attrs.lancamento_id,
    dataApuramento: attrs.data_apuramento,
  }
}

export async function apurarIva(values: ApurarIvaFormValues): Promise<ApuramentoIva> {
  const response = await apiClient.post<RawApuramentoIvaResource>('/contabilidade/apuramento-iva', {
    periodo_id: values.periodoId,
  })
  return mapApuramentoIva(response.data)
}

/** Não há endpoint de listagem — só se chega a um apuramento pelo id devolvido pelo POST. */
export async function getApuramentoIva(id: string): Promise<ApuramentoIva> {
  const response = await apiClient.get<RawApuramentoIvaResource>(
    `/contabilidade/apuramento-iva/${id}`,
  )
  return mapApuramentoIva(response.data)
}
