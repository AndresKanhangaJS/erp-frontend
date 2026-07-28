export type CurrencyCode = 'AOA' | 'USD' | 'EUR'

const CURRENCY_LOCALE = 'pt-AO'

/**
 * AOA é a moeda base. Nunca arredondar na apresentação — mostra sempre
 * as 2 casas decimais, mesmo quando são zero.
 */
export function formatCurrency(value: number, currency: CurrencyCode = 'AOA'): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
