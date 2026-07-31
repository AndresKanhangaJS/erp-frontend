import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

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
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { formatDate } from '@/shared/utils/formatDate'

import { EstadoLancamentoBadge } from '../components/EstadoLancamentoBadge'
import { useAnularLancamento } from '../hooks/useAnularLancamento'
import { useContasArvore } from '../hooks/useContasArvore'
import { useLancamento } from '../hooks/useLancamento'
import { calcularSaldoLancamento } from '../utils'

export default function DetalheLancamentoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: lancamento, isLoading } = useLancamento(id)
  const { data: contas } = useContasArvore()
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

  // O backend só devolve conta_id em cada linha — o código/designação resolve-se aqui contra o plano de contas já carregado.
  const contaPorId = new Map((contas ?? []).map((conta) => [conta.id, conta]))
  const saldo = calcularSaldoLancamento(lancamento.linhas)

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

      {lancamento.lancamentoEstornoId && (
        <p className="text-sm text-text-muted">
          Anulado pela contra-entrada{' '}
          <Link
            to={`/contabilidade/lancamentos/${lancamento.lancamentoEstornoId}`}
            className="underline"
          >
            de estorno
          </Link>
          .
        </p>
      )}
      {lancamento.tipoOrigem === 'automatico' && lancamento.origemTipo === 'fatura' && (
        <p className="text-sm text-text-muted">
          Gerado automaticamente a partir da{' '}
          <Link to={`/faturacao/faturas/${lancamento.origemId}`} className="underline">
            factura de origem
          </Link>
          .
        </p>
      )}

      <Card className="overflow-x-auto py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conta</TableHead>
              <TableHead className="text-right">Débito</TableHead>
              <TableHead className="text-right">Crédito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamento.linhas.map((linha, index) => {
              const conta = contaPorId.get(linha.contaId)
              return (
                <TableRow key={index}>
                  <TableCell>
                    <span className="font-mono text-xs text-text-muted">
                      {conta?.codigo ?? '—'}
                    </span>{' '}
                    {conta?.designacao ?? linha.contaId}
                  </TableCell>
                  <TableCell className="text-right">
                    {linha.debito > 0 && <CurrencyDisplay value={linha.debito} />}
                  </TableCell>
                  <TableCell className="text-right">
                    {linha.credito > 0 && <CurrencyDisplay value={linha.credito} />}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <Card className="ml-auto w-full max-w-sm">
        <CardContent>
          <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
            <span>Total</span>
            <CurrencyDisplay value={saldo.totalDebito} />
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Anular lançamento"
        description={`Tens a certeza que queres anular ${lancamento.numero}? O lançamento não é apagado — fica marcado como anulado e é gerada uma contra-entrada de estorno. Esta acção não pode ser revertida.`}
        destructive
        loading={anular.isPending}
        onConfirm={() =>
          anular.mutate(lancamento.id, {
            onSuccess: ({ estorno }) => {
              setConfirmOpen(false)
              navigate(`/contabilidade/lancamentos/${estorno.id}`)
            },
          })
        }
      />
    </div>
  )
}
