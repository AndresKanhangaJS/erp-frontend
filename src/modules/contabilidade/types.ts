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
