import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { formatDate } from '@/shared/utils/formatDate'

import { EstadoInventarioBadge } from '../components/EstadoInventarioBadge'
import { useArmazens } from '../hooks/useArmazens'
import { useInventarios } from '../hooks/useInventarios'
import type { Inventario } from '../types'

const PER_PAGE = 20

export default function InventariosPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useInventarios({ page: page + 1, perPage: PER_PAGE })
  const { data: armazens } = useArmazens()

  const armazemPorId = new Map((armazens ?? []).map((armazem) => [armazem.id, armazem]))

  const columns: ColumnDef<Inventario>[] = [
    {
      id: 'armazem',
      header: 'Armazém',
      cell: ({ row }) => (
        <Link to={`/stock/inventarios/${row.original.id}`} className="hover:underline">
          {armazemPorId.get(row.original.armazemId)?.nome ?? '—'}
        </Link>
      ),
    },
    {
      accessorKey: 'data',
      header: 'Data',
      cell: ({ row }) => (row.original.data ? formatDate(row.original.data) : '—'),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => <EstadoInventarioBadge estado={row.original.estado} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventários"
        actions={
          <Button asChild>
            <Link to="/stock/inventarios/novo">Novo inventário</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem inventários"
        emptyDescription="Cria o primeiro inventário para o veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
