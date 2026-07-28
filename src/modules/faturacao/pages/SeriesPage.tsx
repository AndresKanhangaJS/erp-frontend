import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { listSeries, type SerieDocumento } from '@/api/modules/faturacao'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'

const columns: ColumnDef<SerieDocumento>[] = [
  {
    accessorKey: 'serie',
    header: 'Série',
    cell: ({ row }) => <span className="font-mono">{row.original.serie}</span>,
  },
  { accessorKey: 'tipo', header: 'Tipo' },
  {
    accessorKey: 'proximoNumero',
    header: 'Próximo número',
    cell: ({ row }) => <span className="font-mono">{row.original.proximoNumero}</span>,
  },
]

export default function SeriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['faturacao', 'series'],
    queryFn: () => listSeries(),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Séries" />
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem séries"
      />
    </div>
  )
}
