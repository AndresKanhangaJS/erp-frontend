import { useState } from 'react'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { formatDateTime } from '@/shared/utils/formatDate'

import { CertificacaoAgtBadge } from '../components/CertificacaoAgtBadge'
import { DocumentoQrCode } from '../components/DocumentoQrCode'
import { EstadoBadge } from '../components/EstadoBadge'
import { TotaisPanel } from '../components/TotaisPanel'
import { useAnularFatura } from '../hooks/useAnularFatura'
import { useFatura } from '../hooks/useFatura'

export default function DetalheDocumentoPage() {
  const { id } = useParams()
  const { data: documento, isLoading } = useFatura(id)
  const anular = useAnularFatura()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading || !documento) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={documento.numero}
        breadcrumbs={[{ label: 'Facturação', href: '/faturacao' }, { label: documento.numero }]}
        actions={
          documento.estado === 'emitido' ? (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Anular
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <EstadoBadge estado={documento.estado} />
        <CertificacaoAgtBadge estado={documento.comunicacaoAgt.estado} />
        <span className="text-sm text-text-muted">
          Emitido em {formatDateTime(documento.dataEmissao)}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface-card p-4">
            <p className="text-sm text-text-secondary">Cliente</p>
            <p className="font-medium text-text-primary">{documento.cliente.nome}</p>
            {documento.cliente.nif && (
              <p className="font-mono text-sm text-text-muted">{documento.cliente.nif}</p>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artigo</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Preço unitário</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documento.linhas.map((linha, index) => (
                  <TableRow key={index}>
                    <TableCell>{linha.designacao}</TableCell>
                    <TableCell className="text-right font-mono">{linha.quantidade}</TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay value={linha.precoUnitario} currency={documento.moeda} />
                    </TableCell>
                    <TableCell className="text-right font-mono">{linha.taxaIva}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TotaisPanel
            subtotal={documento.subtotal}
            totalIva={documento.totalIva}
            total={documento.total}
            moeda={documento.moeda}
            taxaCambio={documento.taxaCambio}
          />
        </div>

        {documento.comunicacaoAgt.qrCodeData && (
          <DocumentoQrCode
            data={documento.comunicacaoAgt.qrCodeData}
            codigoVerificacao={documento.comunicacaoAgt.codigoVerificacao}
          />
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Anular documento"
        description={`Tens a certeza que queres anular ${documento.numero}? Esta acção não pode ser revertida.`}
        destructive
        loading={anular.isPending}
        onConfirm={() => anular.mutate(documento.id, { onSuccess: () => setConfirmOpen(false) })}
      />
    </div>
  )
}
