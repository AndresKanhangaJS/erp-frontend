import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, UserCog } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { StatCard } from '@/shared/components/ui/StatCard'

import { useUtilizadores } from '../hooks/useUtilizadores'
import { USER_ROLE_LABELS, type Utilizador, type UserRole } from '../types'

const PER_PAGE = 20

function roleLabel(role: string): string {
  return USER_ROLE_LABELS[role as UserRole] ?? role
}

const columns: ColumnDef<Utilizador>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => (
      <Link to={`/admin/utilizadores/${row.original.id}`} className="hover:underline">
        {row.original.nome}
      </Link>
    ),
  },
  { accessorKey: 'email', header: 'Email' },
  {
    id: 'roles',
    header: 'Roles',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles.length === 0 && '—'}
        {row.original.roles.map((role) => (
          <Badge key={role} className="bg-surface-raised text-text-secondary">
            {roleLabel(role)}
          </Badge>
        ))}
      </div>
    ),
  },
]

export default function UtilizadoresPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useUtilizadores({ page: page + 1, perPage: PER_PAGE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilizadores"
        actions={
          <Button asChild>
            <Link to="/admin/utilizadores/novo">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Novo utilizador
            </Link>
          </Button>
        }
      />

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total de utilizadores"
            value={data.meta.total}
            icon={UserCog}
            tone="accent"
          />
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem utilizadores"
        emptyDescription="Cria o primeiro utilizador para o veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
