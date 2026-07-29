/** Classes 1–8, estrutura decimal (POC-Angola/NCRF — ver docs/fiscal-angola.md na raiz do monorepo). */
export type TipoConta = 'activo' | 'passivo' | 'capital_proprio' | 'proveito' | 'custo'

export interface Conta {
  id: string
  codigo: string
  designacao: string
  classe: number
  tipo: TipoConta
  contaPaiId: string | null
  /** Só contas-folha aceitam lançamentos directos. */
  permiteLancamentos: boolean
}

export interface LinhaLancamento {
  contaId: string
  contaCodigo: string
  contaDesignacao: string
  debito: number
  credito: number
}

export type EstadoLancamento = 'rascunho' | 'lancado' | 'anulado'

export interface Lancamento {
  id: string
  numero: string
  data: string
  descricao: string
  periodoId: string
  estado: EstadoLancamento
  linhas: LinhaLancamento[]
  totalDebito: number
  totalCredito: number
  createdAt: string
  /** Se este lançamento é uma contra-entrada gerada ao anular outro, o id do lançamento original. */
  estornaLancamentoId: string | null
  /** Se este lançamento foi anulado, o id da contra-entrada gerada. Nunca é apagado nem escondido — só marcado. */
  estornadoPorId: string | null
}

export type EstadoPeriodo = 'aberto' | 'fechado'

export interface Periodo {
  id: string
  ano: number
  mes: number
  estado: EstadoPeriodo
  dataFecho: string | null
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
  periodoId: string
  activo: LinhaDemonstrativo[]
  passivo: LinhaDemonstrativo[]
  capitalProprio: LinhaDemonstrativo[]
  totalActivo: number
  totalPassivo: number
  totalCapitalProprio: number
}

/** Resultado líquido = Proveitos − Custos, por período. */
export interface DemonstracaoResultados {
  periodoId: string
  proveitos: LinhaDemonstrativo[]
  custos: LinhaDemonstrativo[]
  totalProveitos: number
  totalCustos: number
  resultadoLiquido: number
}
