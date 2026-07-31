import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Users } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'
import { StatCard } from '@/shared/components/ui/StatCard'
import { formatDate } from '@/shared/utils/formatDate'

import { EstadoFuncionarioBadge } from '../components/EstadoFuncionarioBadge'
import { useFuncionarios } from '../hooks/useFuncionarios'
import type { Funcionario } from '../types'

const PER_PAGE = 20

const columns: ColumnDef<Funcionario>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => (
      <Link to={`/rh/funcionarios/${row.original.id}`} className="hover:underline">
        {row.original.nome}
      </Link>
    ),
  },
  { accessorKey: 'cargo', header: 'Cargo' },
  {
    accessorKey: 'departamento',
    header: 'Departamento',
    cell: ({ row }) => row.original.departamento ?? '—',
  },
  {
    accessorKey: 'dataAdmissao',
    header: 'Admissão',
    cell: ({ row }) => formatDate(row.original.dataAdmissao),
  },
  {
    accessorKey: 'salarioBase',
    header: 'Salário base',
    cell: ({ row }) => (
      <CurrencyDisplay value={row.original.salarioBase} className="block text-right" />
    ),
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => <EstadoFuncionarioBadge estado={row.original.estado} />,
  },
]

export default function FuncionariosPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useFuncionarios({ page: page + 1, perPage: PER_PAGE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funcionários"
        actions={
          <Button asChild>
            <Link to="/rh/funcionarios/novo">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Novo funcionário
            </Link>
          </Button>
        }
      />

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total de funcionários"
            value={data.meta.total}
            icon={Users}
            tone="accent"
          />
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem funcionários"
        emptyDescription="Regista o primeiro funcionário para o veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
