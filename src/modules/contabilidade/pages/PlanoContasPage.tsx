import { Link } from 'react-router'

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

import { useContasArvore } from '../hooks/useContasArvore'
import type { Conta } from '../types'
import { achatarArvoreContas } from '../utils'

const TIPO_LABELS: Record<Conta['tipo'], string> = {
  activo: 'Activo',
  passivo: 'Passivo',
  capital_proprio: 'Capital Próprio',
  proveito: 'Proveito',
  custo: 'Custo',
}

export default function PlanoContasPage() {
  const { data: contas, isLoading } = useContasArvore()
  const linhas = achatarArvoreContas(contas ?? [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plano de contas"
        actions={
          <Button asChild>
            <Link to="/contabilidade/plano-de-contas/nova">Nova conta</Link>
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Designação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Aceita lançamentos</TableHead>
                <TableHead className="w-px" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-text-muted">
                    Sem contas. Cria a primeira para começares a lançar.
                  </TableCell>
                </TableRow>
              )}
              {linhas.map(({ conta, profundidade }) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-mono text-xs text-text-muted">
                    {conta.codigo}
                  </TableCell>
                  <TableCell style={{ paddingLeft: `${profundidade * 1.5 + 1}rem` }}>
                    {conta.designacao}
                  </TableCell>
                  <TableCell>{TIPO_LABELS[conta.tipo]}</TableCell>
                  <TableCell>{conta.permiteLancamentos ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/contabilidade/plano-de-contas/${conta.id}`}>Editar</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
