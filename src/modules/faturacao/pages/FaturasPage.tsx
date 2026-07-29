import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'
import { formatDate } from '@/shared/utils/formatDate'

import { EstadoBadge } from '../components/EstadoBadge'
import { useFaturas } from '../hooks/useFaturas'
import { useSeries } from '../hooks/useSeries'
import type { Fatura } from '../types'

const PER_PAGE = 20

export default function FaturasPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useFaturas({ page: page + 1, perPage: PER_PAGE })
  const { data: series } = useSeries()

  const codigoSerie = (serieId: string) => series?.find((serie) => serie.id === serieId)?.codigo

  const columns: ColumnDef<Fatura>[] = [
    {
      accessorKey: 'numero',
      header: 'Nº',
      cell: ({ row }) => (
        <Link to={`/faturacao/faturas/${row.original.id}`} className="font-mono hover:underline">
          {codigoSerie(row.original.serieId) ?? row.original.tipoDocumento}/{row.original.numero}
        </Link>
      ),
    },
    { accessorKey: 'tipoDocumento', header: 'Tipo' },
    {
      accessorKey: 'dataEmissao',
      header: 'Data',
      cell: ({ row }) => (row.original.dataEmissao ? formatDate(row.original.dataEmissao) : '—'),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <CurrencyDisplay
          value={row.original.total}
          currency={row.original.moeda}
          className="block text-right"
        />
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => <EstadoBadge estado={row.original.estado} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturas"
        actions={
          <Button asChild>
            <Link to="/faturacao/emitir">Emitir factura</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem facturas"
        emptyDescription="Emite a primeira factura para a veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
