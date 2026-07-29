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
import { formatDate } from '@/shared/utils/formatDate'

import { EstadoLancamentoBadge } from '../components/EstadoLancamentoBadge'
import { useAnularLancamento } from '../hooks/useAnularLancamento'
import { useLancamento } from '../hooks/useLancamento'

export default function DetalheLancamentoPage() {
  const { id } = useParams()
  const { data: lancamento, isLoading } = useLancamento(id)
  const anular = useAnularLancamento()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading || !lancamento) {
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
        title={lancamento.numero}
        breadcrumbs={[
          { label: 'Contabilidade', href: '/contabilidade' },
          { label: 'Lançamentos', href: '/contabilidade/lancamentos' },
          { label: lancamento.numero },
        ]}
        actions={
          lancamento.estado === 'lancado' ? (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Anular
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <EstadoLancamentoBadge estado={lancamento.estado} />
        <span className="text-sm text-text-muted">{formatDate(lancamento.data)}</span>
        <span className="text-sm text-text-secondary">{lancamento.descricao}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conta</TableHead>
              <TableHead className="text-right">Débito</TableHead>
              <TableHead className="text-right">Crédito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamento.linhas.map((linha, index) => (
              <TableRow key={index}>
                <TableCell>
                  <span className="font-mono text-xs text-text-muted">{linha.contaCodigo}</span>{' '}
                  {linha.contaDesignacao}
                </TableCell>
                <TableCell className="text-right">
                  {linha.debito > 0 && <CurrencyDisplay value={linha.debito} />}
                </TableCell>
                <TableCell className="text-right">
                  {linha.credito > 0 && <CurrencyDisplay value={linha.credito} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="ml-auto w-full max-w-sm space-y-1.5 rounded-lg border border-border bg-surface-card p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
          <span>Total</span>
          <CurrencyDisplay value={lancamento.totalDebito} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Anular lançamento"
        description={`Tens a certeza que queres anular ${lancamento.numero}? Esta acção não pode ser revertida.`}
        destructive
        loading={anular.isPending}
        onConfirm={() => anular.mutate(lancamento.id, { onSuccess: () => setConfirmOpen(false) })}
      />
    </div>
  )
}
