import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { listContas } from '@/api/modules/contabilidade'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'

import type { Conta } from '../types'

const PER_PAGE = 50

const TIPO_LABELS: Record<Conta['tipo'], string> = {
  activo: 'Activo',
  passivo: 'Passivo',
  capital_proprio: 'Capital Próprio',
  proveito: 'Proveito',
  custo: 'Custo',
}

const columns: ColumnDef<Conta>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ row }) => <span className="font-mono">{row.original.codigo}</span>,
  },
  { accessorKey: 'designacao', header: 'Designação' },
  { accessorKey: 'classe', header: 'Classe' },
  { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }) => TIPO_LABELS[row.original.tipo] },
]

export default function PlanoContasPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['contabilidade', 'contas', 'lista', { page }],
    queryFn: () => listContas({ page: page + 1, perPage: PER_PAGE }),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Plano de contas" />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem contas"
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
