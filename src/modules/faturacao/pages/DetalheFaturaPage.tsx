import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { formatDate, formatDateTime } from '@/shared/utils/formatDate'

import { AnularFaturaDialog } from '../components/AnularFaturaDialog'
import { EstadoBadge } from '../components/EstadoBadge'
import { FaturaQrCode } from '../components/FaturaQrCode'
import { RegistarPagamentoDialog } from '../components/RegistarPagamentoDialog'
import { TotaisPanel } from '../components/TotaisPanel'
import { useCliente } from '../hooks/useCliente'
import { useFatura } from '../hooks/useFatura'
import { useFaturaPdf } from '../hooks/useFaturaPdf'
import { usePagamentos } from '../hooks/usePagamentos'

const METODO_LABELS: Record<string, string> = {
  transferencia: 'Transferência',
  numerario: 'Numerário',
  outro: 'Outro',
}

export default function DetalheFaturaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: fatura, isLoading } = useFatura(id)
  const { data: cliente } = useCliente(fatura?.clienteId ?? undefined)
  const { data: pagamentos } = usePagamentos(fatura?.estado === 'anulada' ? undefined : id)
  const pdf = useFaturaPdf()
  const [anularOpen, setAnularOpen] = useState(false)
  const [pagamentoOpen, setPagamentoOpen] = useState(false)

  if (isLoading || !fatura) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const podeAnular = fatura.estado === 'emitida' || fatura.estado === 'paga'

  return (
    <div className="space-y-6">
      <PageHeader
        title={fatura.numero}
        breadcrumbs={[{ label: 'Facturação', href: '/faturacao' }, { label: fatura.numero }]}
        actions={
          <div className="flex gap-2">
            <PermissionGuard permission="faturacao.imprimir">
              <Button
                type="button"
                variant="outline"
                disabled={pdf.isPending}
                onClick={() => pdf.mutate(fatura.id)}
              >
                {pdf.isPending ? 'A abrir...' : 'Ver PDF'}
              </Button>
            </PermissionGuard>
            {podeAnular && (
              <PermissionGuard permission="faturacao.anular">
                <Button variant="destructive" onClick={() => setAnularOpen(true)}>
                  Anular
                </Button>
              </PermissionGuard>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <EstadoBadge estado={fatura.estado} />
        <span className="text-sm text-text-muted">
          {fatura.dataEmissao ? `Emitida em ${formatDateTime(fatura.dataEmissao)}` : 'Rascunho'}
        </span>
      </div>

      {fatura.faturaOriginalId && (
        <p className="text-sm text-text-muted">
          Nota de crédito relativa a outra factura ({fatura.faturaOriginalId}).
        </p>
      )}
      {fatura.motivoAnulacao && (
        <p className="text-sm text-text-muted">Motivo de anulação: {fatura.motivoAnulacao}</p>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <Card>
            <CardContent>
              <p className="text-sm text-text-secondary">Cliente</p>
              {cliente ? (
                <>
                  <p className="font-medium text-text-primary">{cliente.nome}</p>
                  {cliente.nif && (
                    <p className="font-mono text-sm text-text-muted">{cliente.nif}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-text-muted">Sem cliente associado</p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-x-auto py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Preço unitário</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(fatura.linhas ?? []).map((linha) => (
                  <TableRow key={linha.id}>
                    <TableCell>{linha.descricao}</TableCell>
                    <TableCell className="text-right font-mono">{linha.quantidade}</TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay value={linha.precoUnitario} currency={fatura.moeda} />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {(linha.taxaIva * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay value={linha.total} currency={fatura.moeda} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <TotaisPanel
            subtotal={fatura.subtotal}
            totalIva={fatura.totalIva}
            total={fatura.total}
            moeda={fatura.moeda}
            taxaCambio={fatura.taxaCambio}
          />

          <Card className="text-xs text-text-muted">
            <CardContent>
              <p>
                Assinatura local (hash encadeado, integridade técnica — não é certificação AGT):
              </p>
              <p className="font-mono break-all">{fatura.hash}</p>
            </CardContent>
          </Card>
        </div>

        <FaturaQrCode faturaId={fatura.id} />
      </div>

      {fatura.estado !== 'anulada' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Pagamentos</h2>
            <PermissionGuard permission="faturacao.criar">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPagamentoOpen(true)}
              >
                Registar pagamento
              </Button>
            </PermissionGuard>
          </div>
          <Card className="overflow-x-auto py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Referência</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(pagamentos ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-text-muted">
                      Sem pagamentos registados.
                    </TableCell>
                  </TableRow>
                )}
                {(pagamentos ?? []).map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell>
                      {pagamento.dataPagamento ? formatDate(pagamento.dataPagamento) : '—'}
                    </TableCell>
                    <TableCell>{METODO_LABELS[pagamento.metodo] ?? pagamento.metodo}</TableCell>
                    <TableCell>{pagamento.referencia ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay value={pagamento.valor} currency={pagamento.moeda} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      <AnularFaturaDialog
        faturaId={fatura.id}
        numero={fatura.numero}
        open={anularOpen}
        onOpenChange={setAnularOpen}
        onAnulada={(notaCreditoId) => navigate(`/faturacao/faturas/${notaCreditoId}`)}
      />
      <RegistarPagamentoDialog
        faturaId={fatura.id}
        open={pagamentoOpen}
        onOpenChange={setPagamentoOpen}
      />
    </div>
  )
}
