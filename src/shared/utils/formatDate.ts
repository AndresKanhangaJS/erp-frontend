import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

const LUANDA_TIMEZONE = 'Africa/Luanda'

/**
 * Angola (WAT, UTC+1) não observa horário de verão, mas calculamos o
 * deslocamento via Intl em vez de hardcodar "+1" para não partir se
 * isso alguma vez mudar. Devolve um Date cujos componentes locais
 * (getFullYear/getMonth/... na timezone do runtime) já são os
 * componentes de Luanda — é isto que o date-fns.format() vai ler.
 */
function toLuandaWallClock(date: Date): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: LUANDA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)

  return new Date(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  )
}

type DateInput = Date | string | number

/** dd/MM/yyyy — nunca MM/dd/yyyy. */
export function formatDate(date: DateInput): string {
  return format(toLuandaWallClock(new Date(date)), 'dd/MM/yyyy', { locale: pt })
}

/** dd/MM/yyyy HH:mm, hora de Luanda. */
export function formatDateTime(date: DateInput): string {
  return format(toLuandaWallClock(new Date(date)), 'dd/MM/yyyy HH:mm', { locale: pt })
}
