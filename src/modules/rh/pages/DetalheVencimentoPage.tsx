import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'

import { useFuncionario } from '../hooks/useFuncionario'
import { useReciboVencimento } from '../hooks/useReciboVencimento'
import { useVencimento } from '../hooks/useVencimento'

function Linha({ label, value, destaque }: { label: string; value: number; destaque?: boolean }) {
  return (
    <div
      className={
        destaque
          ? 'flex items-center justify-between border-t border-border pt-1.5 text-base font-semibold text-text-primary'
          : 'flex items-center justify-between text-sm text-text-secondary'
      }
    >
      <span>{label}</span>
      <CurrencyDisplay value={value} />
    </div>
  )
}

export default function DetalheVencimentoPage() {
  const { id } = useParams()
  const { data: vencimento, isLoading } = useVencimento(id)
  const { data: funcionario } = useFuncionario(vencimento?.funcionarioId)
  const recibo = useReciboVencimento()

  if (isLoading || !vencimento) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full max-w-md" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={funcionario?.nome ?? 'Vencimento'}
        breadcrumbs={[
          { label: 'RH', href: '/rh' },
          { label: 'Folhas salariais', href: '/rh/folhas-salariais' },
          { label: funcionario?.nome ?? 'Vencimento' },
        ]}
        actions={
          <PermissionGuard permission="rh.ver_salarios">
            <Button
              type="button"
              variant="outline"
              disabled={recibo.isPending}
              onClick={() => recibo.mutate(vencimento.id)}
            >
              {recibo.isPending ? 'A abrir...' : 'Ver recibo'}
            </Button>
          </PermissionGuard>
        }
      />

      <Card className="max-w-md">
        <CardContent className="space-y-1.5">
          <Linha label="Salário base" value={vencimento.salarioBase} />
          <Linha label="Subsídio de alimentação" value={vencimento.subsidioAlimentacao} />
          <Linha label="Subsídio de transporte" value={vencimento.subsidioTransporte} />
          <Linha label="Vencimento bruto" value={vencimento.vencimentoBruto} destaque />
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardContent className="space-y-1.5">
          <Linha label="Base tributável IRT" value={vencimento.baseTributavelIrt} />
          <Linha label="IRT" value={vencimento.irt} />
          <Linha label="INSS (trabalhador)" value={vencimento.inssTrabalhador} />
          <p className="pt-1 text-xs text-text-muted">
            INSS a cargo da entidade empregadora (não deduzido ao vencimento):{' '}
            <CurrencyDisplay value={vencimento.inssEmpregador} />
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardContent>
          <Linha label="Vencimento líquido" value={vencimento.vencimentoLiquido} destaque />
        </CardContent>
      </Card>
    </div>
  )
}
