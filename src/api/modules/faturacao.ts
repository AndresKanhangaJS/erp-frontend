import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/shared/types/api'
import { parseMoney, type MoneyWire } from '@/shared/utils/parseMoney'

import type { AnularFaturaFormValues } from '../../modules/faturacao/schemas/anularFaturaSchema'
import type { ArtigoFormValues } from '../../modules/faturacao/schemas/artigoSchema'
import type { ClienteFormValues } from '../../modules/faturacao/schemas/clienteSchema'
import type { EmitirFaturaFormValues } from '../../modules/faturacao/schemas/emitirFaturaSchema'
import type { PagamentoFormValues } from '../../modules/faturacao/schemas/pagamentoSchema'
import type { PeriodoFiscalFormValues } from '../../modules/faturacao/schemas/periodoFiscalSchema'
import type { SaftFormValues } from '../../modules/faturacao/schemas/saftSchema'
import type { SerieFormValues } from '../../modules/faturacao/schemas/serieSchema'
import type { TaxaCambioFormValues } from '../../modules/faturacao/schemas/taxaCambioSchema'
import type {
  Artigo,
  Cliente,
  Fatura,
  FaturaLinha,
  Moeda,
  Pagamento,
  PeriodoFiscal,
  SerieDocumento,
  TaxaCambio,
  TipoDocumento,
} from '../../modules/faturacao/types'

/*
 * Envelope real do backend (docs/api-contract.md): cada recurso vem
 * como {id, type, attributes, created_at, updated_at} — o interceptor
 * de resposta (api/client.ts) já desembrulha o "{data: ...}" externo,
 * mas o achatamento de "attributes" para um objecto de domínio plano é
 * feito aqui, módulo a módulo (ver api/modules/auth.ts para o mesmo
 * padrão). Dinheiro nunca vem como número — vem sempre {amount,currency}.
 */

interface RawFaturaLinha {
  id: string
  artigo_id: string | null
  descricao: string
  quantidade: string
  preco_unitario: MoneyWire | null
  taxa_iva: string
  subtotal: MoneyWire | null
  valor_iva: MoneyWire | null
  total: MoneyWire | null
}

interface RawFaturaResource {
  id: string
  type: 'fatura'
  attributes: {
    numero: string | number
    tipo_documento: TipoDocumento
    estado: string
    serie_id: string
    cliente_id: string | null
    subtotal: MoneyWire | null
    total_iva: MoneyWire | null
    total: MoneyWire | null
    taxa_cambio: string
    hash: string
    hash_anterior: string | null
    fatura_original_id: string | null
    motivo_anulacao: string | null
    data_emissao: string | null
    linhas: RawFaturaLinha[] | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapFaturaLinha(raw: RawFaturaLinha): FaturaLinha {
  return {
    id: raw.id,
    artigoId: raw.artigo_id,
    descricao: raw.descricao,
    quantidade: Number(raw.quantidade),
    precoUnitario: parseMoney(raw.preco_unitario),
    taxaIva: Number(raw.taxa_iva),
    subtotal: parseMoney(raw.subtotal),
    valorIva: parseMoney(raw.valor_iva),
    total: parseMoney(raw.total),
  }
}

function mapFatura(raw: RawFaturaResource): Fatura {
  const attrs = raw.attributes
  const moeda = (attrs.total?.currency ?? attrs.subtotal?.currency ?? 'AOA') as Moeda
  return {
    id: raw.id,
    numero: String(attrs.numero),
    tipoDocumento: attrs.tipo_documento,
    estado: attrs.estado as Fatura['estado'],
    serieId: attrs.serie_id,
    clienteId: attrs.cliente_id,
    subtotal: parseMoney(attrs.subtotal),
    totalIva: parseMoney(attrs.total_iva),
    total: parseMoney(attrs.total),
    moeda,
    taxaCambio: Number(attrs.taxa_cambio),
    hash: attrs.hash,
    hashAnterior: attrs.hash_anterior,
    faturaOriginalId: attrs.fatura_original_id,
    motivoAnulacao: attrs.motivo_anulacao,
    dataEmissao: attrs.data_emissao,
    linhas: attrs.linhas ? attrs.linhas.map(mapFaturaLinha) : null,
    createdAt: raw.created_at,
  }
}

export interface ListFaturasParams {
  page?: number
  perPage?: number
}

export async function listFaturas(
  params: ListFaturasParams = {},
): Promise<PaginatedResponse<Fatura>> {
  const response = await apiClient.get<PaginatedResponse<RawFaturaResource>>('/faturacao/faturas', {
    params: { page: params.page, per_page: params.perPage },
  })
  return { ...response.data, data: response.data.data.map(mapFatura) }
}

export async function getFatura(id: string): Promise<Fatura> {
  const response = await apiClient.get<RawFaturaResource>(`/faturacao/faturas/${id}`)
  return mapFatura(response.data)
}

export async function emitirFatura(values: EmitirFaturaFormValues): Promise<Fatura> {
  const response = await apiClient.post<RawFaturaResource>('/faturacao/faturas', {
    serie_id: values.serieId,
    tipo_documento: values.tipoDocumento,
    cliente_id: values.clienteId || null,
    moeda: values.moeda ?? null,
    taxa_cambio: values.taxaCambio ?? null,
    linhas: values.linhas.map((linha) => ({
      artigo_id: linha.artigoId || null,
      descricao: linha.descricao,
      quantidade: linha.quantidade,
      preco_unitario: linha.precoUnitario ?? null,
    })),
  })
  return mapFatura(response.data)
}

/** Devolve a NOTA DE CRÉDITO gerada — a factura original fica anulada mas nunca é apagada (ADR-008). */
export async function anularFatura(id: string, values: AnularFaturaFormValues): Promise<Fatura> {
  const response = await apiClient.post<RawFaturaResource>(`/faturacao/faturas/${id}/anular`, {
    serie_nc_id: values.serieNcId,
    motivo: values.motivo,
  })
  return mapFatura(response.data)
}

export type FaturaPdfResult = { pronto: true; url: string } | { pronto: false }

/** A geração do PDF é assíncrona (Job) — 202 enquanto não está pronto, 200 com URL assinada (expira em 10 min) quando está. */
export async function getFaturaPdf(id: string): Promise<FaturaPdfResult> {
  const response = await apiClient.get<{ url: string } | { message: string; code: string }>(
    `/faturacao/faturas/${id}/pdf`,
  )
  if (response.status === 202) {
    return { pronto: false }
  }
  return { pronto: true, url: (response.data as { url: string }).url }
}

/** PNG binário directo, atrás de autenticação — não dá para usar num <img src> simples. */
export async function getFaturaQrCodeBlob(id: string): Promise<Blob> {
  const response = await apiClient.get<Blob>(`/faturacao/faturas/${id}/qrcode`, {
    responseType: 'blob',
  })
  return response.data
}

interface RawClienteResource {
  id: string
  type: 'cliente'
  attributes: {
    nome: string
    nif: string | null
    email: string | null
    telefone: string | null
    morada: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapCliente(raw: RawClienteResource): Cliente {
  return { id: raw.id, ...raw.attributes }
}

export interface ListClientesParams {
  page?: number
  perPage?: number
  search?: string
}

export async function listClientes(
  params: ListClientesParams = {},
): Promise<PaginatedResponse<Cliente>> {
  const response = await apiClient.get<PaginatedResponse<RawClienteResource>>(
    '/faturacao/clientes',
    { params: { page: params.page, per_page: params.perPage, search: params.search } },
  )
  return { ...response.data, data: response.data.data.map(mapCliente) }
}

export async function getCliente(id: string): Promise<Cliente> {
  const response = await apiClient.get<RawClienteResource>(`/faturacao/clientes/${id}`)
  return mapCliente(response.data)
}

export async function criarCliente(values: ClienteFormValues): Promise<Cliente> {
  const response = await apiClient.post<RawClienteResource>('/faturacao/clientes', values)
  return mapCliente(response.data)
}

export async function editarCliente(id: string, values: ClienteFormValues): Promise<Cliente> {
  const response = await apiClient.put<RawClienteResource>(`/faturacao/clientes/${id}`, values)
  return mapCliente(response.data)
}

interface RawArtigoResource {
  id: string
  type: 'artigo'
  attributes: {
    codigo: string
    nome: string
    preco_unitario: MoneyWire | null
    taxa_iva: string
    unidade: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapArtigo(raw: RawArtigoResource): Artigo {
  const attrs = raw.attributes
  return {
    id: raw.id,
    codigo: attrs.codigo,
    nome: attrs.nome,
    precoUnitario: parseMoney(attrs.preco_unitario),
    moeda: (attrs.preco_unitario?.currency ?? 'AOA') as Moeda,
    taxaIva: Number(attrs.taxa_iva),
    unidade: attrs.unidade,
  }
}

export interface ListArtigosParams {
  page?: number
  perPage?: number
  search?: string
}

export async function listArtigos(
  params: ListArtigosParams = {},
): Promise<PaginatedResponse<Artigo>> {
  const response = await apiClient.get<PaginatedResponse<RawArtigoResource>>('/faturacao/artigos', {
    params: { page: params.page, per_page: params.perPage, search: params.search },
  })
  return { ...response.data, data: response.data.data.map(mapArtigo) }
}

export async function criarArtigo(values: ArtigoFormValues): Promise<Artigo> {
  const response = await apiClient.post<RawArtigoResource>('/faturacao/artigos', {
    codigo: values.codigo,
    nome: values.nome,
    preco_unitario: values.precoUnitario,
    moeda: values.moeda ?? null,
    taxa_iva: values.taxaIva ?? null,
    unidade: values.unidade ?? null,
  })
  return mapArtigo(response.data)
}

interface RawSerieDocumentoResource {
  id: string
  type: 'serie_documento'
  attributes: {
    tipo_documento: TipoDocumento
    codigo: string
    ano_fiscal: string | number
    ultimo_numero: string | number
    activa: boolean
  }
  created_at: string | null
  updated_at: string | null
}

function mapSerie(raw: RawSerieDocumentoResource): SerieDocumento {
  const attrs = raw.attributes
  return {
    id: raw.id,
    tipoDocumento: attrs.tipo_documento,
    codigo: attrs.codigo,
    anoFiscal: Number(attrs.ano_fiscal),
    ultimoNumero: Number(attrs.ultimo_numero),
    activa: attrs.activa,
  }
}

export async function listSeries(): Promise<SerieDocumento[]> {
  const response =
    await apiClient.get<PaginatedResponse<RawSerieDocumentoResource>>('/faturacao/series')
  return response.data.data.map(mapSerie)
}

export async function criarSerie(values: SerieFormValues): Promise<SerieDocumento> {
  const response = await apiClient.post<RawSerieDocumentoResource>('/faturacao/series', {
    tipo_documento: values.tipoDocumento,
    codigo: values.codigo,
    ano_fiscal: values.anoFiscal,
  })
  return mapSerie(response.data)
}

interface RawPagamentoResource {
  id: string
  type: 'pagamento'
  attributes: {
    fatura_id: string
    valor: MoneyWire | null
    metodo: string
    referencia: string | null
    data_pagamento: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapPagamento(raw: RawPagamentoResource): Pagamento {
  const attrs = raw.attributes
  return {
    id: raw.id,
    faturaId: attrs.fatura_id,
    valor: parseMoney(attrs.valor),
    moeda: (attrs.valor?.currency ?? 'AOA') as Moeda,
    metodo: attrs.metodo as Pagamento['metodo'],
    referencia: attrs.referencia,
    dataPagamento: attrs.data_pagamento,
    createdAt: raw.created_at,
  }
}

export async function listPagamentos(faturaId: string): Promise<Pagamento[]> {
  const response = await apiClient.get<PaginatedResponse<RawPagamentoResource>>(
    `/faturacao/faturas/${faturaId}/pagamentos`,
  )
  return response.data.data.map(mapPagamento)
}

export async function registarPagamento(
  faturaId: string,
  values: PagamentoFormValues,
): Promise<Pagamento> {
  const response = await apiClient.post<RawPagamentoResource>(
    `/faturacao/faturas/${faturaId}/pagamentos`,
    {
      valor: values.valor,
      metodo: values.metodo,
      referencia: values.referencia ?? null,
      data_pagamento: values.dataPagamento ?? null,
    },
  )
  return mapPagamento(response.data)
}

interface RawPeriodoFiscalResource {
  id: string
  type: 'periodo_fiscal'
  attributes: {
    ano_fiscal: string | number
    mes: string | number | null
    fechado: boolean
    fechado_em: string | null
  }
  created_at: string | null
  updated_at: string | null
}

function mapPeriodoFiscal(raw: RawPeriodoFiscalResource): PeriodoFiscal {
  const attrs = raw.attributes
  return {
    id: raw.id,
    anoFiscal: Number(attrs.ano_fiscal),
    mes: attrs.mes === null ? null : Number(attrs.mes),
    fechado: attrs.fechado,
    fechadoEm: attrs.fechado_em,
  }
}

export async function listPeriodosFiscais(): Promise<PeriodoFiscal[]> {
  const response = await apiClient.get<PaginatedResponse<RawPeriodoFiscalResource>>(
    '/faturacao/periodos-fiscais',
  )
  return response.data.data.map(mapPeriodoFiscal)
}

export async function criarPeriodoFiscal(values: PeriodoFiscalFormValues): Promise<PeriodoFiscal> {
  const response = await apiClient.post<RawPeriodoFiscalResource>('/faturacao/periodos-fiscais', {
    ano_fiscal: values.anoFiscal,
    mes: values.mes ?? null,
  })
  return mapPeriodoFiscal(response.data)
}

export async function fecharPeriodoFiscal(id: string): Promise<PeriodoFiscal> {
  const response = await apiClient.post<RawPeriodoFiscalResource>(
    `/faturacao/periodos-fiscais/${id}/fechar`,
  )
  return mapPeriodoFiscal(response.data)
}

interface RawTaxaCambioResource {
  id: string
  type: 'taxa_cambio'
  attributes: {
    moeda: string
    taxa: string
    data: string
  }
  created_at: string | null
  updated_at: string | null
}

function mapTaxaCambio(raw: RawTaxaCambioResource): TaxaCambio {
  const attrs = raw.attributes
  return {
    id: raw.id,
    moeda: attrs.moeda as Moeda,
    taxa: Number(attrs.taxa),
    data: attrs.data,
  }
}

export async function listTaxasCambio(): Promise<TaxaCambio[]> {
  const response =
    await apiClient.get<PaginatedResponse<RawTaxaCambioResource>>('/faturacao/taxas-cambio')
  return response.data.data.map(mapTaxaCambio)
}

export async function criarTaxaCambio(values: TaxaCambioFormValues): Promise<TaxaCambio> {
  const response = await apiClient.post<RawTaxaCambioResource>('/faturacao/taxas-cambio', {
    moeda: values.moeda,
    taxa: values.taxa,
    data: values.data,
  })
  return mapTaxaCambio(response.data)
}

/** Exportação assíncrona (Job) — a resposta é só a confirmação de que o job foi despachado. */
export async function exportarSaft(values: SaftFormValues): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/faturacao/saft/exportar', {
    ano_fiscal: values.anoFiscal,
    mes: values.mes ?? null,
  })
  return response.data
}
