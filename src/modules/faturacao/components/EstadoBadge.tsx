import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoFatura } from '../types'

const CONFIG: Record<EstadoFatura, { label: string; className: string }> = {
  rascunho: { label: 'Rascunho', className: 'bg-surface-raised text-text-secondary' },
  emitida: { label: 'Emitida', className: 'bg-success-subtle text-success' },
  paga: { label: 'Paga', className: 'bg-info-subtle text-info' },
  anulada: { label: 'Anulada', className: 'bg-danger-subtle text-danger' },
}

interface EstadoBadgeProps {
  estado: EstadoFatura
  className?: string
}

export function EstadoBadge({ estado, className }: EstadoBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
