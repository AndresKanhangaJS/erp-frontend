export interface Armazem {
  id: string
  codigo: string
  nome: string
  endereco: string | null
  isPadrao: boolean
}

export interface Existencia {
  armazemId: string
  artigoId: string
  quantidade: number
  custoMedio: number
}

/** ajuste nasce de um inventário fechado; transferência é sempre um par saída/entrada — nenhum dos dois se cria directamente aqui. */
export type TipoMovimentoStock = 'entrada' | 'saida' | 'ajuste' | 'transferencia'

export interface MovimentoStock {
  id: string
  armazemId: string
  artigoId: string
  artigoCodigo: string
  artigoNome: string
  tipo: TipoMovimentoStock
  quantidade: number
  custoUnitario: number
  data: string | null
  origemTipo: string | null
  origemId: string | null
  observacoes: string | null
  /** Se este movimento foi anulado, o id da contra-entrada gerada. */
  movimentoEstornoId: string | null
}

export type EstadoInventario = 'aberto' | 'fechado'

export interface InventarioLinha {
  id: string
  artigoId: string
  artigoCodigo: string
  artigoNome: string
  quantidadeSistema: number
  quantidadeContada: number
}

export interface Inventario {
  id: string
  armazemId: string
  estado: EstadoInventario
  data: string | null
  observacoes: string | null
  linhas: InventarioLinha[] | null
}
