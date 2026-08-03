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

/** Estado da série perante a AGT — devolvido por listarSeries (secção 9). */
export type AgtEstadoSerie = 'A' | 'U' | 'F'
export type AgtIndicadorContingencia = 'N' | 'C'
export type AgtMetodoFacturacao = 'FEPC' | 'FESF' | 'SF'

export interface SerieAgt {
  seriesCode: string | null
  authorizedQuantity: number | null
  firstDocumentNo: number | null
  lastDocumentNo: number | null
  estado: AgtEstadoSerie | null
  indicadorContingencia: AgtIndicadorContingencia | null
  metodoFacturacao: AgtMetodoFacturacao | null
}

export interface SerieDocumento {
  id: string
  tipoDocumento: TipoDocumento
  codigo: string
  anoFiscal: number
  ultimoNumero: number
  activa: boolean
  /** null até se pedir quota à AGT (POST /faturacao/agt/series/solicitar) — sem isto a série não é utilizável a sério. */
  agt: SerieAgt
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

/**
 * Estado da factura perante a AGT — independente do estado de negócio
 * local (EstadoFatura). "nao_aplicavel" cobre integração desligada ou
 * tenant sem credenciais configuradas.
 */
export type AgtEstadoSubmissao =
  | 'nao_aplicavel'
  | 'pendente'
  | 'submetida'
  | 'valida'
  | 'invalida'
  | 'anulada_agt'
  | 'substituida'
  | 'erro'

export interface FaturaAgt {
  estado: AgtEstadoSubmissao
  documentNo: string | null
  documentStatus: string | null
  validadaEm: string | null
  erros: unknown[] | null
  reportUrl: string | null
  tentativas: number | null
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
  /** Assinatura local em cadeia (integridade técnica) — não é certificação AGT; ver campo agt para o estado de certificação real. */
  hash: string
  hashAnterior: string | null
  faturaOriginalId: string | null
  motivoAnulacao: string | null
  dataEmissao: string | null
  /** null quando a listagem não carrega as linhas — só show/store/anular trazem linhas populadas. */
  linhas: FaturaLinha[] | null
  createdAt: string | null
  agt: FaturaAgt
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

export type AmbienteAgt = 'hml' | 'prd'

/**
 * Nunca traz username/password/chave_privada_pem/certificado_pem — o
 * backend nunca os devolve (ver AgtConfiguracaoResource, erp-api). Um
 * formulário de edição só sabe se já há credenciais via temCredenciais.
 */
export interface AgtConfiguracao {
  nifEmitente: string | null
  establishmentNumber: string | null
  eacCode: string | null
  codigoIsencaoPadrao: string | null
  ambiente: AmbienteAgt
  activa: boolean
  aderiuEm: string | null
  tipoAdesao: string | null
  temCredenciais: boolean
}

/** Uma entrada de listarSeries directamente da AGT — não é o SerieDocumento local, é o que a AGT tem registado. */
export interface AgtSerieInfo {
  seriesCode: string | null
  seriesYear: string | null
  documentType: string | null
  seriesStatus: string | null
  seriesCreationDate: string | null
  firstDocumentCreated: string | null
  lastDocumentCreated: string | null
  firstDocumentNumber: string | null
  invoicingMethod: string | null
  seriesContingencyIndicator: string | null
  seriesStartTS: string | null
  seriesEndTS: string | null
  nif: string | null
  nome: string | null
  dataAdesao: string | null
  tipoAdesao: string | null
}
