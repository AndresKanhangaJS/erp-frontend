import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { BookOpen, Plus } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { StatCard } from '@/shared/components/ui/StatCard'
import { formatDate } from '@/shared/utils/formatDate'

import { EstadoLancamentoBadge } from '../components/EstadoLancamentoBadge'
import { useLancamentos } from '../hooks/useLancamentos'
import type { Lancamento } from '../types'
import { calcularSaldoLancamento } from '../utils'

const PER_PAGE = 20

const columns: ColumnDef<Lancamento>[] = [
  {
    accessorKey: 'numero',
    header: 'Nº Lançamento',
    cell: ({ row }) => (
      <Link
        to={`/contabilidade/lancamentos/${row.original.id}`}
        className="font-mono hover:underline"
      >
        {row.original.numero}
      </Link>
    ),
  },
  { accessorKey: 'data', header: 'Data', cell: ({ row }) => formatDate(row.original.data) },
  { accessorKey: 'descricao', header: 'Descrição' },
  {
    id: 'total',
    header: 'Total',
    cell: ({ row }) => (
      <CurrencyDisplay
        value={calcularSaldoLancamento(row.original.linhas).totalDebito}
        className="block text-right"
      />
    ),
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => <EstadoLancamentoBadge estado={row.original.estado} />,
  },
]

export default function LancamentosPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useLancamentos({ page: page + 1, perPage: PER_PAGE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lançamentos"
        actions={
          <PermissionGuard permission="contabilidade.lancar">
            <Button asChild>
              <Link to="/contabilidade/lancamentos/novo">
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Novo lançamento
              </Link>
            </Button>
          </PermissionGuard>
        }
      />

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total de lançamentos"
            value={data.meta.total}
            icon={BookOpen}
            tone="accent"
          />
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem lançamentos"
        emptyDescription="Cria o primeiro lançamento para o veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
