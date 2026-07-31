export type EstadoFuncionario = 'activo' | 'inactivo'

export interface Funcionario {
  id: string
  nome: string
  nif: string | null
  numeroSegurancaSocial: string | null
  cargo: string
  departamento: string | null
  dataAdmissao: string
  dataCessacao: string | null
  estado: EstadoFuncionario
  salarioBase: number
  subsidioAlimentacao: number
  subsidioTransporte: number
}

/** Imutável (ADR-008): uma folha processada nunca é editada, só anulada. */
export type EstadoFolhaSalarial = 'processada' | 'anulada'

export interface FolhaSalarial {
  id: string
  anoFiscal: number
  mes: number
  estado: EstadoFolhaSalarial
  dataProcessamento: string
}

export interface Vencimento {
  id: string
  folhaId: string
  funcionarioId: string
  salarioBase: number
  subsidioAlimentacao: number
  subsidioTransporte: number
  vencimentoBruto: number
  baseTributavelIrt: number
  irt: number
  inssTrabalhador: number
  inssEmpregador: number
  vencimentoLiquido: number
}
