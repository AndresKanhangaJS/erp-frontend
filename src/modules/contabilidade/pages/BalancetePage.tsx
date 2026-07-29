import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'

import { PeriodoPicker } from '../components/PeriodoPicker'
import { useBalancete } from '../hooks/useBalancete'
import type { SaldoConta } from '../types'

const columns: ColumnDef<SaldoConta>[] = [
  {
    accessorKey: 'contaCodigo',
    header: 'Código',
    cell: ({ row }) => <span className="font-mono">{row.original.contaCodigo}</span>,
  },
  { accessorKey: 'contaDesignacao', header: 'Conta' },
  {
    accessorKey: 'saldoAnterior',
    header: 'Saldo anterior',
    cell: ({ row }) => (
      <CurrencyDisplay value={row.original.saldoAnterior} className="block text-right" />
    ),
  },
  {
    accessorKey: 'debito',
    header: 'Débito',
    cell: ({ row }) => <CurrencyDisplay value={row.original.debito} className="block text-right" />,
  },
  {
    accessorKey: 'credito',
    header: 'Crédito',
    cell: ({ row }) => (
      <CurrencyDisplay value={row.original.credito} className="block text-right" />
    ),
  },
  {
    accessorKey: 'saldoAtual',
    header: 'Saldo actual',
    cell: ({ row }) => (
      <CurrencyDisplay value={row.original.saldoAtual} className="block text-right" />
    ),
  },
]

export default function BalancetePage() {
  const [periodoId, setPeriodoId] = useState('')
  const { data, isLoading } = useBalancete(periodoId || undefined)

  return (
    <div className="space-y-6">
      <PageHeader title="Balancete" />

      <div className="max-w-xs space-y-1">
        <label htmlFor="periodo-balancete" className="text-sm text-text-secondary">
          Período
        </label>
        <PeriodoPicker
          id="periodo-balancete"
          value={periodoId}
          onChange={setPeriodoId}
          apenasAbertos={false}
        />
      </div>

      {periodoId && (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          emptyTitle="Sem saldos"
          emptyDescription="Este período ainda não tem movimentos."
        />
      )}
    </div>
  )
}
