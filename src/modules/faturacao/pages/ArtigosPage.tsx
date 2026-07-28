import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { listArtigos } from '@/api/modules/faturacao'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'

import type { Artigo } from '../types'

const PER_PAGE = 20

const columns: ColumnDef<Artigo>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ row }) => <span className="font-mono">{row.original.codigo}</span>,
  },
  { accessorKey: 'designacao', header: 'Designação' },
  {
    accessorKey: 'precoUnitario',
    header: 'Preço unitário',
    cell: ({ row }) => (
      <CurrencyDisplay value={row.original.precoUnitario} className="block text-right" />
    ),
  },
  { accessorKey: 'taxaIva', header: 'IVA', cell: ({ row }) => `${row.original.taxaIva}%` },
]

export default function ArtigosPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['faturacao', 'artigos', 'lista', { page }],
    queryFn: () => listArtigos({ page: page + 1, perPage: PER_PAGE }),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Artigos" />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem artigos"
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
