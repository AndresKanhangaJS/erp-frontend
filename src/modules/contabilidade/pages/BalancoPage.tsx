import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import { PeriodoPicker } from '../components/PeriodoPicker'
import { useBalanco } from '../hooks/useBalanco'
import type { LinhaDemonstrativo } from '../types'

function GrupoTable({
  titulo,
  linhas,
  total,
}: {
  titulo: string
  linhas: LinhaDemonstrativo[]
  total: number
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-text-primary">{titulo}</h2>
      <Card className="overflow-x-auto py-0">
        <Table>
          <TableBody>
            {linhas.length === 0 && (
              <TableRow>
                <TableCell className="text-text-muted">Sem contas com saldo.</TableCell>
              </TableRow>
            )}
            {linhas.map((linha) => (
              <TableRow key={linha.contaId}>
                <TableCell>
                  <span className="font-mono text-xs text-text-muted">{linha.contaCodigo}</span>{' '}
                  {linha.contaDesignacao}
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay value={linha.valor} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold">Total {titulo}</TableCell>
              <TableCell className="text-right font-semibold">
                <CurrencyDisplay value={total} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  )
}

export default function BalancoPage() {
  const [periodoId, setPeriodoId] = useState('')
  const { data: balanco, isLoading } = useBalanco(periodoId)

  const totalPassivoMaisCapital = balanco ? balanco.totalPassivo + balanco.totalCapitalProprio : 0
  const equilibrado = balanco
    ? Math.abs(balanco.totalActivo - totalPassivoMaisCapital) < 0.005
    : true

  return (
    <div className="space-y-6">
      <PageHeader
        title="Balanço"
        breadcrumbs={[{ label: 'Contabilidade', href: '/contabilidade' }, { label: 'Balanço' }]}
      />

      <div className="max-w-xs space-y-1">
        <label htmlFor="periodo-balanco" className="text-sm text-text-secondary">
          Período
        </label>
        <PeriodoPicker
          id="periodo-balanco"
          value={periodoId}
          onChange={setPeriodoId}
          apenasAbertos={false}
        />
      </div>

      {periodoId && isLoading && <p className="text-sm text-text-muted">A carregar...</p>}

      {periodoId && balanco && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <GrupoTable titulo="Activo" linhas={balanco.activo} total={balanco.totalActivo} />
            <div className="space-y-6">
              <GrupoTable titulo="Passivo" linhas={balanco.passivo} total={balanco.totalPassivo} />
              <GrupoTable
                titulo="Capital Próprio"
                linhas={balanco.capitalProprio}
                total={balanco.totalCapitalProprio}
              />
            </div>
          </div>

          <Card className="text-sm">
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Activo</span>
                <CurrencyDisplay value={balanco.totalActivo} className="font-semibold" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Passivo + Capital Próprio</span>
                <CurrencyDisplay value={totalPassivoMaisCapital} className="font-semibold" />
              </div>
              {!equilibrado && (
                <p className="mt-2 text-danger">
                  O balanço não está equilibrado — verifica os lançamentos deste período.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
