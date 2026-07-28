import { useId, type ChangeEvent } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatCurrency, type CurrencyCode } from '@/shared/utils/formatCurrency'

interface CurrencyInputProps {
  value: number | null
  onChange: (value: number | null) => void
  currency?: CurrencyCode
  id?: string
  name?: string
  disabled?: boolean
  placeholder?: string
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/**
 * Máscara por dígitos: digitar "12500" mostra "125,00" — os últimos 2
 * dígitos são sempre os cêntimos, sem matemática de posição do cursor.
 */
export function CurrencyInput({
  value,
  onChange,
  currency = 'AOA',
  id,
  className,
  ...rest
}: CurrencyInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const display = value === null ? '' : formatCurrency(value, currency)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, '')
    if (!digitsOnly) {
      onChange(null)
      return
    }
    onChange(Number(digitsOnly) / 100)
  }

  return (
    <Input
      id={inputId}
      inputMode="decimal"
      value={display}
      onChange={handleChange}
      className={cn('text-right font-mono tabular-nums', className)}
      {...rest}
    />
  )
}
