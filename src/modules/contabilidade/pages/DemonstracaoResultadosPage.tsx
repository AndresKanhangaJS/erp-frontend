import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import { PeriodoPicker } from '../components/PeriodoPicker'
import { useDemonstracaoResultados } from '../hooks/useDemonstracaoResultados'
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
                <TableCell className="text-text-muted">Sem contas com movimento.</TableCell>
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

export default function DemonstracaoResultadosPage() {
  const [periodoId, setPeriodoId] = useState('')
  const { data: dr, isLoading } = useDemonstracaoResultados(periodoId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demonstração de Resultados"
        breadcrumbs={[
          { label: 'Contabilidade', href: '/contabilidade' },
          { label: 'Demonstração de Resultados' },
        ]}
      />

      <div className="max-w-xs space-y-1">
        <label htmlFor="periodo-dr" className="text-sm text-text-secondary">
          Período
        </label>
        <PeriodoPicker
          id="periodo-dr"
          value={periodoId}
          onChange={setPeriodoId}
          apenasAbertos={false}
        />
      </div>

      {periodoId && isLoading && <p className="text-sm text-text-muted">A carregar...</p>}

      {periodoId && dr && (
        <>
          <GrupoTable titulo="Proveitos" linhas={dr.proveitos} total={dr.totalProveitos} />
          <GrupoTable titulo="Custos" linhas={dr.custos} total={dr.totalCustos} />

          <Card>
            <CardContent className="flex items-center justify-between text-sm font-semibold text-text-primary">
              <span>Resultado líquido</span>
              <CurrencyDisplay
                value={dr.resultadoLiquido}
                className={dr.resultadoLiquido < 0 ? 'text-danger' : undefined}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
