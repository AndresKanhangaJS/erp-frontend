import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { DataTable } from '@/shared/components/ui/DataTable'

import { EstadoPeriodoBadge } from '../components/EstadoPeriodoBadge'
import { useFecharPeriodo, usePeriodos } from '../hooks/usePeriodos'
import type { Periodo } from '../types'

export default function PeriodosPage() {
  const { data: periodos, isLoading } = usePeriodos()
  const fechar = useFecharPeriodo()
  const [periodoParaFechar, setPeriodoParaFechar] = useState<Periodo | null>(null)

  const columns: ColumnDef<Periodo>[] = [
    {
      accessorKey: 'mes',
      header: 'Período',
      cell: ({ row }) => `${String(row.original.mes).padStart(2, '0')}/${row.original.ano}`,
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => <EstadoPeriodoBadge estado={row.original.estado} />,
    },
    {
      id: 'acoes',
      header: '',
      cell: ({ row }) =>
        row.original.estado === 'aberto' ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPeriodoParaFechar(row.original)}
          >
            Fechar período
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Períodos" />
      <DataTable
        columns={columns}
        data={periodos ?? []}
        isLoading={isLoading}
        emptyTitle="Sem períodos"
      />

      <ConfirmDialog
        open={periodoParaFechar !== null}
        onOpenChange={(open) => !open && setPeriodoParaFechar(null)}
        title="Fechar período"
        description={
          periodoParaFechar
            ? `Depois de fechado, ${String(periodoParaFechar.mes).padStart(2, '0')}/${periodoParaFechar.ano} deixa de aceitar novos lançamentos. Esta acção não pode ser revertida.`
            : ''
        }
        destructive
        loading={fechar.isPending}
        onConfirm={() => {
          if (periodoParaFechar) {
            fechar.mutate(periodoParaFechar.id, { onSuccess: () => setPeriodoParaFechar(null) })
          }
        }}
      />
    </div>
  )
}
