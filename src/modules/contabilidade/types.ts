/** Classes 1–8, estrutura decimal (POC-Angola/NCRF — ver docs/fiscal-angola.md na raiz do monorepo). */
export type TipoConta = 'activo' | 'passivo' | 'capital_proprio' | 'proveito' | 'custo'

export interface Conta {
  id: string
  codigo: string
  designacao: string
  tipo: TipoConta
  contaPaiId: string | null
  /** Só contas-folha aceitam lançamentos directos. */
  permiteLancamentos: boolean
}

export interface LinhaLancamento {
  contaId: string
  debito: number
  credito: number
}

/** Um lançamento nunca é editado nem apagado — só "lancado" ou "anulado" (a correcção é sempre um estorno). */
export type EstadoLancamento = 'lancado' | 'anulado'

/** manual = criado por um utilizador; automatico = gerado por outro módulo (ex.: Facturação). */
export type TipoOrigemLancamento = 'manual' | 'automatico'

export interface Lancamento {
  id: string
  numero: string
  data: string
  descricao: string
  periodoId: string
  estado: EstadoLancamento
  tipoOrigem: TipoOrigemLancamento
  /** Ex.: "fatura", quando tipoOrigem é automático. */
  origemTipo: string | null
  origemId: string | null
  /** Se este lançamento foi anulado, o id da contra-entrada gerada — nunca é apagado nem escondido, só marcado. */
  lancamentoEstornoId: string | null
  linhas: LinhaLancamento[]
  createdAt: string | null
}

export interface Periodo {
  id: string
  anoFiscal: number
  mes: number
  fechado: boolean
  fechadoEm: string | null
}

export interface SaldoConta {
  contaId: string
  contaCodigo: string
  contaDesignacao: string
  saldoAnterior: number
  debito: number
  credito: number
  saldoAtual: number
}

export interface LinhaDemonstrativo {
  contaId: string
  contaCodigo: string
  contaDesignacao: string
  valor: number
}

/** Activo = Passivo + Capital Próprio, por período. */
export interface Balanco {
  activo: LinhaDemonstrativo[]
  passivo: LinhaDemonstrativo[]
  capitalProprio: LinhaDemonstrativo[]
  resultadoAcumulado: number
  totalActivo: number
  totalPassivo: number
  totalCapitalProprio: number
}

/** Resultado líquido = Proveitos − Custos, por período. */
export interface DemonstracaoResultados {
  proveitos: LinhaDemonstrativo[]
  custos: LinhaDemonstrativo[]
  totalProveitos: number
  totalCustos: number
  resultadoLiquido: number
}

export interface ApuramentoIva {
  id: string
  periodoId: string
  ivaLiquidado: number
  ivaDedutivel: number
  ivaApurado: number
  /** Lançamento contabilístico gerado automaticamente pelo apuramento. */
  lancamentoId: string | null
  dataApuramento: string | null
}
