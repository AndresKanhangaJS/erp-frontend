import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { DataTable } from '@/shared/components/ui/DataTable'
import { formatDate } from '@/shared/utils/formatDate'

import { CertificacaoAgtBadge } from '../components/CertificacaoAgtBadge'
import { EstadoBadge } from '../components/EstadoBadge'
import { useFaturas } from '../hooks/useFaturas'
import type { DocumentoFiscal } from '../types'

const PER_PAGE = 20

const columns: ColumnDef<DocumentoFiscal>[] = [
  {
    accessorKey: 'numero',
    header: 'Nº Documento',
    cell: ({ row }) => (
      <Link to={`/faturacao/documentos/${row.original.id}`} className="font-mono hover:underline">
        {row.original.numero}
      </Link>
    ),
  },
  { accessorKey: 'cliente', header: 'Cliente', cell: ({ row }) => row.original.cliente.nome },
  {
    accessorKey: 'dataEmissao',
    header: 'Data',
    cell: ({ row }) => formatDate(row.original.dataEmissao),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => (
      <CurrencyDisplay
        value={row.original.total}
        currency={row.original.moeda}
        className="block text-right"
      />
    ),
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => <EstadoBadge estado={row.original.estado} />,
  },
  {
    id: 'agt',
    header: 'AGT',
    cell: ({ row }) => <CertificacaoAgtBadge estado={row.original.comunicacaoAgt.estado} />,
  },
]

export default function DocumentosPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useFaturas({ page: page + 1, perPage: PER_PAGE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        actions={
          <Button asChild>
            <Link to="/faturacao/emitir">Emitir factura</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Sem documentos"
        emptyDescription="Emite a primeira factura para a veres aqui."
        pagination={
          data
            ? { pageIndex: page, pageCount: data.meta.last_page, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  )
}
