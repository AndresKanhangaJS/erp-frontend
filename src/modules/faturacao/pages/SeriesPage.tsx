import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'

import { useSeries } from '../hooks/useSeries'
import type { SerieDocumento } from '../types'

const columns: ColumnDef<SerieDocumento>[] = [
  {
    accessorKey: 'codigo',
    header: 'Série',
    cell: ({ row }) => <span className="font-mono">{row.original.codigo}</span>,
  },
  { accessorKey: 'tipoDocumento', header: 'Tipo' },
  { accessorKey: 'anoFiscal', header: 'Ano fiscal' },
  {
    accessorKey: 'ultimoNumero',
    header: 'Último número',
    cell: ({ row }) => <span className="font-mono">{row.original.ultimoNumero}</span>,
  },
  {
    accessorKey: 'activa',
    header: 'Activa',
    cell: ({ row }) => (row.original.activa ? 'Sim' : 'Não'),
  },
]

export default function SeriesPage() {
  const { data, isLoading } = useSeries()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Séries"
        actions={
          <PermissionGuard permission="faturacao.criar">
            <Button asChild>
              <Link to="/faturacao/series/nova">Nova série</Link>
            </Button>
          </PermissionGuard>
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem séries"
      />
    </div>
  )
}
