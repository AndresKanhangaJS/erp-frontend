import { useState, type FormEvent } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DataTable } from '@/shared/components/ui/DataTable'

import { useSeriesAgt } from '../hooks/useSeriesAgt'
import type { AgtSerieInfo } from '../types'

const ESTADO_LABELS: Record<string, string> = { A: 'Aberta', U: 'Em utilização', F: 'Fechada' }
const METODO_LABELS: Record<string, string> = {
  FEPC: 'Portal',
  FESF: 'Software',
  SF: 'Não electrónica',
}

const columns: ColumnDef<AgtSerieInfo>[] = [
  { accessorKey: 'seriesCode', header: 'Série', cell: ({ row }) => row.original.seriesCode ?? '—' },
  { accessorKey: 'seriesYear', header: 'Ano', cell: ({ row }) => row.original.seriesYear ?? '—' },
  {
    accessorKey: 'documentType',
    header: 'Tipo',
    cell: ({ row }) => row.original.documentType ?? '—',
  },
  {
    accessorKey: 'seriesStatus',
    header: 'Estado',
    cell: ({ row }) =>
      (row.original.seriesStatus && ESTADO_LABELS[row.original.seriesStatus]) ??
      row.original.seriesStatus ??
      '—',
  },
  {
    accessorKey: 'invoicingMethod',
    header: 'Método',
    cell: ({ row }) =>
      (row.original.invoicingMethod && METODO_LABELS[row.original.invoicingMethod]) ??
      row.original.invoicingMethod ??
      '—',
  },
  {
    accessorKey: 'firstDocumentNumber',
    header: 'Primeiro nº',
    cell: ({ row }) => row.original.firstDocumentNumber ?? '—',
  },
]

/** Consulta directa à AGT (secção 9) — não é a lista local de séries, é o que a AGT tem registado para este NIF. */
export default function AgtSeriesPage() {
  const [pesquisado, setPesquisado] = useState(false)
  const [seriesYear, setSeriesYear] = useState('')
  const [seriesCode, setSeriesCode] = useState('')

  const { data, isLoading, refetch } = useSeriesAgt(
    { seriesYear: seriesYear || undefined, seriesCode: seriesCode || undefined },
    pesquisado,
  )

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (pesquisado) {
      refetch()
    } else {
      setPesquisado(true)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Séries na AGT" />

      <form
        onSubmit={onSubmit}
        className="flex items-end gap-4 rounded-xl bg-surface-card p-4 ring-1 ring-foreground/10"
      >
        <div className="space-y-1">
          <label htmlFor="seriesYear" className="text-sm text-text-secondary">
            Ano (opcional)
          </label>
          <Input
            id="seriesYear"
            className="w-28"
            value={seriesYear}
            onChange={(event) => setSeriesYear(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="seriesCode" className="text-sm text-text-secondary">
            Código da série (opcional)
          </label>
          <Input
            id="seriesCode"
            className="w-40"
            value={seriesCode}
            onChange={(event) => setSeriesCode(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'A consultar...' : 'Consultar'}
        </Button>
      </form>

      {pesquisado && (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          emptyTitle="Sem séries encontradas"
          emptyDescription="A AGT não tem nenhuma série registada com estes filtros."
        />
      )}
    </div>
  )
}
