import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { listArtigos } from '@/api/modules/faturacao'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'

import { ArmazemPicker } from '../components/ArmazemPicker'
import { useArmazens } from '../hooks/useArmazens'
import { useExistencias } from '../hooks/useExistencias'
import type { Existencia } from '../types'

const PER_PAGE = 20

export default function ExistenciasPage() {
  const [page, setPage] = useState(0)
  const [armazemId, setArmazemId] = useState('')
  const { data: armazens } = useArmazens()
  const { data, isLoading } = useExistencias({
    page: page + 1,
    perPage: PER_PAGE,
    armazemId: armazemId || undefined,
  })
  const { data: artigos } = useQuery({
    queryKey: ['faturacao', 'artigos', 'lookup'],
    queryFn: () => listArtigos({ perPage: 500 }),
    staleTime: 60_000,
  })

  const armazemPorId = new Map((armazens ?? []).map((armazem) => [armazem.id, armazem]))
  const artigoPorId = new Map((artigos?.data ?? []).map((artigo) => [artigo.id, artigo]))

  const columns: ColumnDef<Existencia>[] = [
    {
      id: 'armazem',
      header: 'Armazém',
      cell: ({ row }) => armazemPorId.get(row.original.armazemId)?.nome ?? '—',
    },
    {
      id: 'artigo',
      header: 'Artigo',
      cell: ({ row }) => {
        const artigo = artigoPorId.get(row.original.artigoId)
        return artigo ? (
          <>
            <span className="font-mono text-xs text-text-muted">{artigo.codigo}</span> {artigo.nome}
          </>
        ) : (
          '—'
        )
      },
    },
    {
      accessorKey: 'quantidade',
      header: 'Quantidade',
      cell: ({ row }) => (
        <span className="block text-right font-mono">{row.original.quantidade}</span>
      ),
    },
    {
      accessorKey: 'custoMedio',
      header: 'Custo médio',
      cell: ({ row }) => (
        <CurrencyDisplay value={row.original.custoMedio} className="block text-right" />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Existências" />

      <div className="max-w-xs space-y-1">
        <label htmlFor="armazem" className="text-sm text-text-secondary">
          Filtrar por armazém
        </label>
        <ArmazemPicker id="armazem" value={armazemId} onChange={setArmazemId} />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem existências"
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
