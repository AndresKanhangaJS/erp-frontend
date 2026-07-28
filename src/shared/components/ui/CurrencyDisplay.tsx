import { cn } from '@/lib/utils'
import { formatCurrency, type CurrencyCode } from '@/shared/utils/formatCurrency'

interface CurrencyDisplayProps {
  value: number
  currency?: CurrencyCode
  className?: string
}

/** Nunca renderizar um valor monetário sem passar por aqui (Regra de Ouro #6). */
export function CurrencyDisplay({ value, currency = 'AOA', className }: CurrencyDisplayProps) {
  return (
    <span className={cn('font-mono tabular-nums', className)}>
      {formatCurrency(value, currency)}
    </span>
  )
}
