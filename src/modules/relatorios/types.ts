export interface DashboardVendas {
  totalFacturado: number
  numeroFacturas: number
}

export interface DashboardFinanceiro {
  resultadoLiquido: number
}

export interface DashboardPessoal {
  custoTotal: number
}

export interface DashboardComercial {
  leadsPorEstado: Record<string, number>
  valorPipelineAberto: number
}

export interface DashboardStock {
  valorExistencias: number
}

/** Cada bloco vem null quando o módulo fonte não está activo no plano do tenant. */
export interface Dashboard {
  vendas: DashboardVendas | null
  financeiro: DashboardFinanceiro | null
  pessoal: DashboardPessoal | null
  comercial: DashboardComercial | null
  stock: DashboardStock | null
}
