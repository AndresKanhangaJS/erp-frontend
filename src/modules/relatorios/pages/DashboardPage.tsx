import { useState, type ReactNode } from 'react'
import { Boxes, Calculator, Handshake, Receipt, Users, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import { useDashboard } from '../hooks/useDashboard'
import { useExportarDashboard } from '../hooks/useExportarDashboard'

const ESTADO_LABELS: Record<string, string> = {
  novo: 'Novos',
  contactado: 'Contactados',
  qualificado: 'Qualificados',
  desqualificado: 'Desqualificados',
}

function Cartao({
  titulo,
  icon: Icon,
  children,
}: {
  titulo: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent-subtle text-brand-accent">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-sm text-text-secondary">{titulo}</p>
        </div>
        <div className="mt-2">{children}</div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const { data: dashboard, isLoading } = useDashboard({ ano, mes })
  const exportar = useExportarDashboard()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        actions={
          <Button
            type="button"
            variant="outline"
            disabled={exportar.isPending}
            onClick={() => exportar.mutate({ ano, mes })}
          >
            {exportar.isPending ? 'A exportar...' : 'Exportar CSV'}
          </Button>
        }
      />

      <div className="flex items-end gap-4">
        <div className="space-y-1">
          <label htmlFor="ano" className="text-sm text-text-secondary">
            Ano
          </label>
          <Input
            id="ano"
            type="number"
            className="w-28"
            value={ano}
            onChange={(event) => setAno(Number(event.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="mes" className="text-sm text-text-secondary">
            Mês
          </label>
          <Input
            id="mes"
            type="number"
            min={1}
            max={12}
            className="w-24"
            value={mes}
            onChange={(event) => setMes(Number(event.target.value))}
          />
        </div>
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && dashboard && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboard.vendas && (
            <Cartao titulo="Vendas" icon={Receipt}>
              <CurrencyDisplay
                value={dashboard.vendas.totalFacturado}
                className="block text-2xl font-semibold text-text-primary"
              />
              <p className="text-sm text-text-muted">
                {dashboard.vendas.numeroFacturas} factura(s)
              </p>
            </Cartao>
          )}

          {dashboard.financeiro && (
            <Cartao titulo="Resultado líquido" icon={Calculator}>
              <CurrencyDisplay
                value={dashboard.financeiro.resultadoLiquido}
                className={
                  dashboard.financeiro.resultadoLiquido < 0
                    ? 'block text-2xl font-semibold text-danger'
                    : 'block text-2xl font-semibold text-text-primary'
                }
              />
            </Cartao>
          )}

          {dashboard.pessoal && (
            <Cartao titulo="Custo com pessoal" icon={Users}>
              <CurrencyDisplay
                value={dashboard.pessoal.custoTotal}
                className="block text-2xl font-semibold text-text-primary"
              />
            </Cartao>
          )}

          {dashboard.comercial && (
            <Cartao titulo="Pipeline comercial" icon={Handshake}>
              <CurrencyDisplay
                value={dashboard.comercial.valorPipelineAberto}
                className="block text-2xl font-semibold text-text-primary"
              />
              <p className="text-sm text-text-muted">Valor em aberto</p>
              <div className="mt-2 space-y-1">
                {Object.entries(dashboard.comercial.leadsPorEstado).map(([estado, total]) => (
                  <div key={estado} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{ESTADO_LABELS[estado] ?? estado}</span>
                    <span className="font-mono text-text-primary">{total}</span>
                  </div>
                ))}
              </div>
            </Cartao>
          )}

          {dashboard.stock && (
            <Cartao titulo="Valor em existências" icon={Boxes}>
              <CurrencyDisplay
                value={dashboard.stock.valorExistencias}
                className="block text-2xl font-semibold text-text-primary"
              />
            </Cartao>
          )}

          {!dashboard.vendas &&
            !dashboard.financeiro &&
            !dashboard.pessoal &&
            !dashboard.comercial &&
            !dashboard.stock && (
              <p className="col-span-full text-sm text-text-muted">
                Nenhum módulo com dados de relatório está activo no teu plano.
              </p>
            )}
        </div>
      )}
    </div>
  )
}
