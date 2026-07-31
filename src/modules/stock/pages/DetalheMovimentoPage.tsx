import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { formatDate } from '@/shared/utils/formatDate'

import { useArmazens } from '../hooks/useArmazens'
import { useEstornarMovimento } from '../hooks/useEstornarMovimento'
import { useMovimento } from '../hooks/useMovimento'

const TIPO_LABELS: Record<string, string> = {
  entrada: 'Entrada',
  saida: 'Saída',
  ajuste: 'Ajuste',
  transferencia: 'Transferência',
}

export default function DetalheMovimentoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: movimento, isLoading } = useMovimento(id)
  const { data: armazens } = useArmazens()
  const estornar = useEstornarMovimento()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading || !movimento) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const armazem = (armazens ?? []).find((a) => a.id === movimento.armazemId)
  const podeEstornar = movimento.tipo !== 'ajuste' && !movimento.movimentoEstornoId

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader
        title={movimento.artigoNome}
        breadcrumbs={[
          { label: 'Stock', href: '/stock' },
          { label: 'Movimentos', href: '/stock/movimentos' },
          { label: movimento.artigoNome },
        ]}
        actions={
          podeEstornar ? (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Estornar
            </Button>
          ) : undefined
        }
      />

      {movimento.movimentoEstornoId && (
        <p className="text-sm text-text-muted">
          Estornado pelo movimento{' '}
          <Link to={`/stock/movimentos/${movimento.movimentoEstornoId}`} className="underline">
            de contrapartida
          </Link>
          .
        </p>
      )}

      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-secondary">Artigo</p>
              <p className="font-medium text-text-primary">
                <span className="font-mono text-xs text-text-muted">{movimento.artigoCodigo}</span>{' '}
                {movimento.artigoNome}
              </p>
            </div>
            <div>
              <p className="text-text-secondary">Armazém</p>
              <p className="font-medium text-text-primary">{armazem?.nome ?? '—'}</p>
            </div>
            <div>
              <p className="text-text-secondary">Tipo</p>
              <p className="font-medium text-text-primary">
                {TIPO_LABELS[movimento.tipo] ?? movimento.tipo}
              </p>
            </div>
            <div>
              <p className="text-text-secondary">Quantidade</p>
              <p className="font-mono font-medium text-text-primary">{movimento.quantidade}</p>
            </div>
            <div>
              <p className="text-text-secondary">Custo unitário</p>
              <CurrencyDisplay value={movimento.custoUnitario} className="font-medium" />
            </div>
            <div>
              <p className="text-text-secondary">Data</p>
              <p className="font-medium text-text-primary">
                {movimento.data ? formatDate(movimento.data) : '—'}
              </p>
            </div>
          </div>
          {movimento.observacoes && (
            <p className="mt-4 text-sm text-text-muted">Observações: {movimento.observacoes}</p>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Estornar movimento"
        description="Gera um contra-movimento para reverter o efeito deste. O movimento original não é apagado. Esta acção não pode ser revertida."
        destructive
        loading={estornar.isPending}
        onConfirm={() =>
          estornar.mutate(movimento.id, {
            onSuccess: (estorno) => {
              setConfirmOpen(false)
              navigate(`/stock/movimentos/${estorno.id}`)
            },
          })
        }
      />
    </div>
  )
}
