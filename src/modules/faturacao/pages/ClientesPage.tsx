import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { listClientes } from '@/api/modules/faturacao'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'

import type { Cliente } from '../types'

const PER_PAGE = 20

const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => (
      <Link to={`/faturacao/clientes/${row.original.id}`} className="hover:underline">
        {row.original.nome}
      </Link>
    ),
  },
  { accessorKey: 'nif', header: 'NIF', cell: ({ row }) => row.original.nif ?? '—' },
  { accessorKey: 'email', header: 'Email', cell: ({ row }) => row.original.email ?? '—' },
  { accessorKey: 'telefone', header: 'Telefone', cell: ({ row }) => row.original.telefone ?? '—' },
]

export default function ClientesPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useQuery({
    queryKey: ['faturacao', 'clientes', 'lista', { page }],
    queryFn: () => listClientes({ page: page + 1, perPage: PER_PAGE }),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        actions={
          <PermissionGuard permission="faturacao.criar">
            <Button asChild>
              <Link to="/faturacao/clientes/novo">Novo cliente</Link>
            </Button>
          </PermissionGuard>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem clientes"
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
