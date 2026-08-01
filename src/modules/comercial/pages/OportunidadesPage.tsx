import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Target } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { StatCard } from '@/shared/components/ui/StatCard'

import { useOportunidades } from '../hooks/useOportunidades'
import { usePipelines } from '../hooks/usePipelines'
import type { Oportunidade } from '../types'

const PER_PAGE = 20

export default function OportunidadesPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useOportunidades({ page: page + 1, perPage: PER_PAGE })
  const { data: pipelines } = usePipelines()

  const estagioPorId = new Map(
    (pipelines ?? []).flatMap((pipeline) =>
      pipeline.estagios.map((estagio) => [estagio.id, estagio]),
    ),
  )

  const columns: ColumnDef<Oportunidade>[] = [
    {
      accessorKey: 'titulo',
      header: 'Título',
      cell: ({ row }) => (
        <Link to={`/comercial/oportunidades/${row.original.id}`} className="hover:underline">
          {row.original.titulo}
        </Link>
      ),
    },
    {
      accessorKey: 'valorEstimado',
      header: 'Valor estimado',
      cell: ({ row }) => (
        <CurrencyDisplay value={row.original.valorEstimado} className="block text-right" />
      ),
    },
    {
      accessorKey: 'probabilidade',
      header: 'Probabilidade',
      cell: ({ row }) => `${row.original.probabilidade}%`,
    },
    {
      accessorKey: 'pipelineEstagioId',
      header: 'Estágio',
      cell: ({ row }) => estagioPorId.get(row.original.pipelineEstagioId)?.nome ?? '—',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Oportunidades"
        actions={
          <PermissionGuard permission="comercial.gerir_pipeline">
            <Button asChild>
              <Link to="/comercial/oportunidades/nova">
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Nova oportunidade
              </Link>
            </Button>
          </PermissionGuard>
        }
      />
      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total de oportunidades"
            value={data.meta.total}
            icon={Target}
            tone="accent"
          />
        </div>
      )}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem oportunidades"
        emptyDescription="Cria a primeira oportunidade para a veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
