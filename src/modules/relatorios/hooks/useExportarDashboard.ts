import { useMutation } from '@tanstack/react-query'

import { exportarDashboardCsv, type DashboardParams } from '@/api/modules/relatorios'

/** Descarrega o CSV directamente no browser — o pedido precisa dos cabeçalhos de autenticação, por isso não pode ser um link simples. */
export function useExportarDashboard() {
  return useMutation({
    mutationFn: (params: DashboardParams) => exportarDashboardCsv(params),
    onSuccess: (blob, params) => {
      const url = URL.createObjectURL(blob)
      const ano = params.ano ?? new Date().getFullYear()
      const mes = params.mes ?? new Date().getMonth() + 1
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-dashboard-${ano}-${mes}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    },
  })
}
