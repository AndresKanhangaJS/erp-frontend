import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import type { Moeda } from '../types'

interface TotaisPanelProps {
  subtotal: number
  totalIva: number
  total: number
  moeda?: Moeda
  taxaCambio?: number | null
}

export function TotaisPanel({
  subtotal,
  totalIva,
  total,
  moeda = 'AOA',
  taxaCambio,
}: TotaisPanelProps) {
  return (
    <div className="ml-auto w-full max-w-xs space-y-1.5 rounded-lg border border-border bg-surface-card p-4">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Subtotal</span>
        <CurrencyDisplay value={subtotal} currency={moeda} />
      </div>
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>IVA</span>
        <CurrencyDisplay value={totalIva} currency={moeda} />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-1.5 text-base font-semibold text-text-primary">
        <span>Total</span>
        <CurrencyDisplay value={total} currency={moeda} />
      </div>
      {moeda !== 'AOA' && taxaCambio != null && (
        <p className="pt-1 text-xs text-text-muted">
          Taxa de câmbio: 1 {moeda} = {taxaCambio.toFixed(2)} AOA
        </p>
      )}
    </div>
  )
}
