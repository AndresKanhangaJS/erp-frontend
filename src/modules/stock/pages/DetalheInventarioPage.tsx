import { useState } from 'react'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { cn } from '@/lib/utils'

import { EstadoInventarioBadge } from '../components/EstadoInventarioBadge'
import { useArmazens } from '../hooks/useArmazens'
import { useFecharInventario } from '../hooks/useFecharInventario'
import { useInventario } from '../hooks/useInventario'

export default function DetalheInventarioPage() {
  const { id } = useParams()
  const { data: inventario, isLoading } = useInventario(id)
  const { data: armazens } = useArmazens()
  const fechar = useFecharInventario()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading || !inventario) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const armazem = (armazens ?? []).find((a) => a.id === inventario.armazemId)

  return (
    <div className="space-y-6">
      <PageHeader
        title={armazem?.nome ?? 'Inventário'}
        breadcrumbs={[
          { label: 'Stock', href: '/stock' },
          { label: 'Inventários', href: '/stock/inventarios' },
          { label: armazem?.nome ?? 'Inventário' },
        ]}
        actions={
          inventario.estado === 'aberto' ? (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Fechar inventário
            </Button>
          ) : undefined
        }
      />

      <EstadoInventarioBadge estado={inventario.estado} />

      {inventario.observacoes && (
        <p className="text-sm text-text-muted">{inventario.observacoes}</p>
      )}

      <Card className="overflow-x-auto py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artigo</TableHead>
              <TableHead className="text-right">Quantidade sistema</TableHead>
              <TableHead className="text-right">Quantidade contada</TableHead>
              <TableHead className="text-right">Diferença</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(inventario.linhas ?? []).map((linha) => {
              const diferenca = linha.quantidadeContada - linha.quantidadeSistema
              return (
                <TableRow key={linha.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-text-muted">{linha.artigoCodigo}</span>{' '}
                    {linha.artigoNome}
                  </TableCell>
                  <TableCell className="text-right font-mono">{linha.quantidadeSistema}</TableCell>
                  <TableCell className="text-right font-mono">{linha.quantidadeContada}</TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono',
                      diferenca !== 0 && (diferenca > 0 ? 'text-success' : 'text-danger'),
                    )}
                  >
                    {diferenca > 0 ? '+' : ''}
                    {diferenca}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Fechar inventário"
        description="Ao fechar, as diferenças entre a contagem física e o sistema geram movimentos de ajuste automáticos. Esta acção não pode ser revertida."
        destructive
        loading={fechar.isPending}
        onConfirm={() => fechar.mutate(inventario.id, { onSuccess: () => setConfirmOpen(false) })}
      />
    </div>
  )
}
