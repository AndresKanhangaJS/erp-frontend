import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoLancamento } from '../types'

const CONFIG: Record<EstadoLancamento, { label: string; className: string }> = {
  lancado: { label: 'Lançado', className: 'bg-success-subtle text-success' },
  anulado: { label: 'Anulado', className: 'bg-danger-subtle text-danger' },
}

interface EstadoLancamentoBadgeProps {
  estado: EstadoLancamento
  className?: string
}

export function EstadoLancamentoBadge({ estado, className }: EstadoLancamentoBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
