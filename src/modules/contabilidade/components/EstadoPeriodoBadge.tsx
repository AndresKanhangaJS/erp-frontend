import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoPeriodo } from '../types'

const CONFIG: Record<EstadoPeriodo, { label: string; className: string }> = {
  aberto: { label: 'Aberto', className: 'bg-success-subtle text-success' },
  fechado: { label: 'Fechado', className: 'bg-surface-raised text-text-secondary' },
}

interface EstadoPeriodoBadgeProps {
  estado: EstadoPeriodo
  className?: string
}

export function EstadoPeriodoBadge({ estado, className }: EstadoPeriodoBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
