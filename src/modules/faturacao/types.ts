export type TipoDocumento = 'FT' | 'FR' | 'NC' | 'ND' | 'VD' | 'RC'
/** NC/ND nunca se emitem directamente — só via POST /faturas/{id}/anular. */
export type TipoDocumentoEmissao = 'FT' | 'FR' | 'VD' | 'RC'
export type EstadoFatura = 'rascunho' | 'emitida' | 'paga' | 'anulada'
export type Moeda = 'AOA' | 'USD' | 'EUR'

export interface Cliente {
  id: string
  nome: string
  nif: string | null
  email: string | null
  telefone: string | null
  morada: string | null
}

export interface Artigo {
  id: string
  codigo: string
  nome: string
  precoUnitario: number
  moeda: Moeda
  /** Fracção, não percentagem — 0.14 representa 14%. */
  taxaIva: number
  unidade: string | null
}

export interface SerieDocumento {
  id: string
  tipoDocumento: TipoDocumento
  codigo: string
  anoFiscal: number
  ultimoNumero: number
  activa: boolean
}

export interface FaturaLinha {
  id: string
  artigoId: string | null
  descricao: string
  quantidade: number
  precoUnitario: number
  /** Fracção, não percentagem. */
  taxaIva: number
  subtotal: number
  valorIva: number
  total: number
}

export interface Fatura {
  id: string
  numero: string
  tipoDocumento: TipoDocumento
  estado: EstadoFatura
  serieId: string
  clienteId: string | null
  subtotal: number
  totalIva: number
  total: number
  moeda: Moeda
  taxaCambio: number
  /** Assinatura local em cadeia (integridade técnica) — não é certificação AGT. */
  hash: string
  hashAnterior: string | null
  faturaOriginalId: string | null
  motivoAnulacao: string | null
  dataEmissao: string | null
  /** null quando a listagem não carrega as linhas — só show/store/anular trazem linhas populadas. */
  linhas: FaturaLinha[] | null
  createdAt: string | null
}

export type MetodoPagamento = 'transferencia' | 'numerario' | 'outro'

export interface Pagamento {
  id: string
  faturaId: string
  valor: number
  moeda: Moeda
  metodo: MetodoPagamento
  referencia: string | null
  dataPagamento: string | null
  createdAt: string | null
}

export interface PeriodoFiscal {
  id: string
  anoFiscal: number
  /** null/0 = período fecha o ano inteiro; 1-12 = fecha só o mês. */
  mes: number | null
  fechado: boolean
  fechadoEm: string | null
}

export interface TaxaCambio {
  id: string
  /** AOA nunca tem taxa própria — é sempre a moeda base. */
  moeda: Moeda
  taxa: number
  data: string
}
