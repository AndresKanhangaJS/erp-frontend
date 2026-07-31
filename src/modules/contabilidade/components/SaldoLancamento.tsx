import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'
import { cn } from '@/lib/utils'

import type { SaldoLancamentoCalculado } from '../utils'

interface SaldoLancamentoProps {
  saldo: SaldoLancamentoCalculado
}

/** Mostra os totais e se o lançamento está equilibrado (partidas dobradas). */
export function SaldoLancamento({ saldo }: SaldoLancamentoProps) {
  return (
    <Card className="ml-auto w-full max-w-sm">
      <CardContent className="space-y-1.5">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Total débito</span>
          <CurrencyDisplay value={saldo.totalDebito} />
        </div>
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Total crédito</span>
          <CurrencyDisplay value={saldo.totalCredito} />
        </div>
        <div
          className={cn(
            'flex items-center gap-2 border-t border-border pt-1.5 text-sm font-medium',
            saldo.equilibrado ? 'text-success' : 'text-danger',
          )}
        >
          {saldo.equilibrado ? (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Lançamento equilibrado
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Diferença de <CurrencyDisplay value={Math.abs(saldo.diferenca)} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
