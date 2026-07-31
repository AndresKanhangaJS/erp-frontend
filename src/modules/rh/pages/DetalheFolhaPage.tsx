import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router'

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
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import { EstadoFolhaBadge } from '../components/EstadoFolhaBadge'
import { useAnularFolha } from '../hooks/useAnularFolha'
import { useFolha } from '../hooks/useFolha'
import { useFuncionarios } from '../hooks/useFuncionarios'
import { useVencimentosDaFolha } from '../hooks/useVencimentosDaFolha'

export default function DetalheFolhaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: folha, isLoading } = useFolha(id)
  const { data: vencimentos, isLoading: isLoadingVencimentos } = useVencimentosDaFolha(id)
  const { data: funcionarios } = useFuncionarios({ page: 1, perPage: 500 })
  const anular = useAnularFolha()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading || !folha) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const nomePorId = new Map((funcionarios?.data ?? []).map((f) => [f.id, f.nome]))

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${String(folha.mes).padStart(2, '0')}/${folha.anoFiscal}`}
        breadcrumbs={[
          { label: 'RH', href: '/rh' },
          { label: 'Folhas salariais', href: '/rh/folhas-salariais' },
          { label: `${String(folha.mes).padStart(2, '0')}/${folha.anoFiscal}` },
        ]}
        actions={
          folha.estado === 'processada' ? (
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Anular
            </Button>
          ) : undefined
        }
      />

      <EstadoFolhaBadge estado={folha.estado} />

      <Card className="overflow-x-auto py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead className="text-right">Vencimento bruto</TableHead>
              <TableHead className="text-right">IRT</TableHead>
              <TableHead className="text-right">INSS</TableHead>
              <TableHead className="text-right">Vencimento líquido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoadingVencimentos && (vencimentos ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-text-muted">
                  Sem vencimentos nesta folha.
                </TableCell>
              </TableRow>
            )}
            {(vencimentos ?? []).map((vencimento) => (
              <TableRow key={vencimento.id}>
                <TableCell>
                  <Link to={`/rh/vencimentos/${vencimento.id}`} className="hover:underline">
                    {nomePorId.get(vencimento.funcionarioId) ?? vencimento.funcionarioId}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay value={vencimento.vencimentoBruto} />
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay value={vencimento.irt} />
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay value={vencimento.inssTrabalhador} />
                </TableCell>
                <TableCell className="text-right font-semibold">
                  <CurrencyDisplay value={vencimento.vencimentoLiquido} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Anular folha salarial"
        description="Tens a certeza que queres anular esta folha? Esta acção não pode ser revertida."
        destructive
        loading={anular.isPending}
        onConfirm={() =>
          anular.mutate(folha.id, {
            onSuccess: () => {
              setConfirmOpen(false)
              navigate('/rh/folhas-salariais')
            },
          })
        }
      />
    </div>
  )
}
