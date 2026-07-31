import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'

import { EstadoLeadBadge } from '../components/EstadoLeadBadge'
import { useLeads } from '../hooks/useLeads'
import type { Lead } from '../types'

const PER_PAGE = 20

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => (
      <Link to={`/comercial/leads/${row.original.id}`} className="hover:underline">
        {row.original.nome}
      </Link>
    ),
  },
  { accessorKey: 'empresa', header: 'Empresa', cell: ({ row }) => row.original.empresa ?? '—' },
  { accessorKey: 'email', header: 'Email', cell: ({ row }) => row.original.email ?? '—' },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => <EstadoLeadBadge estado={row.original.estado} />,
  },
]

export default function LeadsPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useLeads({ page: page + 1, perPage: PER_PAGE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        actions={
          <Button asChild>
            <Link to="/comercial/leads/novo">Novo lead</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem leads"
        emptyDescription="Regista o primeiro lead para o veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
