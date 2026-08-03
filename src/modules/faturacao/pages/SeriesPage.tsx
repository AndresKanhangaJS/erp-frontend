import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useSeries } from '../hooks/useSeries'
import { useSolicitarSerieAgt } from '../hooks/useSolicitarSerieAgt'
import type { SerieDocumento } from '../types'

const ESTADO_AGT_LABELS: Record<string, string> = { A: 'Aberta', U: 'Em utilização', F: 'Fechada' }

export default function SeriesPage() {
  const { data, isLoading } = useSeries()
  const solicitar = useSolicitarSerieAgt()

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
    {
      id: 'quotaAgt',
      header: 'Quota AGT',
      cell: ({ row }) => {
        const { agt } = row.original
        if (!agt.seriesCode) {
          return <span className="text-sm text-text-muted">Sem quota pedida</span>
        }
        return (
          <div className="space-y-0.5">
            <Badge className="bg-info-subtle text-info">
              {(agt.estado && ESTADO_AGT_LABELS[agt.estado]) ?? agt.estado}
            </Badge>
            {agt.firstDocumentNo !== null && agt.lastDocumentNo !== null && (
              <p className="font-mono text-xs text-text-muted">
                {agt.firstDocumentNo}–{agt.lastDocumentNo}
              </p>
            )}
          </div>
        )
      },
    },
    {
      id: 'acoesAgt',
      header: '',
      cell: ({ row }) =>
        !row.original.agt.seriesCode ? (
          <PermissionGuard permission="faturacao.agt_gerir_series">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={solicitar.isPending}
              onClick={() =>
                solicitar.mutate(row.original.id, {
                  onSuccess: () => toast.success('Quota AGT pedida com sucesso.'),
                  onError: (error) =>
                    toast.error(getApiErrorMessage(error, 'Não foi possível pedir a quota à AGT.')),
                })
              }
            >
              {solicitar.isPending ? 'A pedir...' : 'Solicitar quota AGT'}
            </Button>
          </PermissionGuard>
        ) : null,
    },
  ]

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
