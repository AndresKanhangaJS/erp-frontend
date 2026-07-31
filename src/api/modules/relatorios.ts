import { apiClient } from '@/api/client'
import { parseMoney, type MoneyWire } from '@/shared/utils/parseMoney'

import type { Dashboard } from '../../modules/relatorios/types'

/**
 * Sem envelope {id,type,attributes} — é um agregado computado on-demand
 * a partir de vários módulos (DashboardResource estende JsonResource
 * simples no backend, não BaseResource), mesmo princípio de
 * BalancoResource em Contabilidade. Laravel ainda envolve a resposta em
 * {"data": ...} por omissão, e o interceptor de resposta já desembrulha
 * isso — aqui só falta o achatamento de nomes e o parse de dinheiro.
 */
interface RawDashboard {
  vendas: { total_facturado: MoneyWire | null; numero_facturas: number } | null
  financeiro: { resultado_liquido: MoneyWire | null } | null
  pessoal: { custo_total: MoneyWire | null } | null
  comercial: {
    leads_por_estado: Record<string, number>
    valor_pipeline_aberto: MoneyWire | null
  } | null
  stock: { valor_existencias: MoneyWire | null } | null
}

function mapDashboard(raw: RawDashboard): Dashboard {
  return {
    vendas: raw.vendas && {
      totalFacturado: parseMoney(raw.vendas.total_facturado),
      numeroFacturas: raw.vendas.numero_facturas,
    },
    financeiro: raw.financeiro && {
      resultadoLiquido: parseMoney(raw.financeiro.resultado_liquido),
    },
    pessoal: raw.pessoal && { custoTotal: parseMoney(raw.pessoal.custo_total) },
    comercial: raw.comercial && {
      leadsPorEstado: raw.comercial.leads_por_estado,
      valorPipelineAberto: parseMoney(raw.comercial.valor_pipeline_aberto),
    },
    stock: raw.stock && { valorExistencias: parseMoney(raw.stock.valor_existencias) },
  }
}

export interface DashboardParams {
  ano?: number
  mes?: number
}

export async function getDashboard(params: DashboardParams = {}): Promise<Dashboard> {
  const response = await apiClient.get<RawDashboard>('/relatorios/dashboard', {
    params: { ano: params.ano, mes: params.mes },
  })
  return mapDashboard(response.data)
}

/** CSV devolvido como stream de download directo — nunca JSON. */
export async function exportarDashboardCsv(params: DashboardParams = {}): Promise<Blob> {
  const response = await apiClient.get<Blob>('/relatorios/dashboard/exportar', {
    params: { ano: params.ano, mes: params.mes },
    responseType: 'blob',
  })
  return response.data
}
