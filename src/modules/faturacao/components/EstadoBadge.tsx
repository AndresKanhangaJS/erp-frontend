import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoDocumento } from '../types'

const CONFIG: Record<EstadoDocumento, { label: string; className: string }> = {
  rascunho: { label: 'Rascunho', className: 'bg-surface-raised text-text-secondary' },
  emitido: { label: 'Emitido', className: 'bg-success-subtle text-success' },
  anulado: { label: 'Anulado', className: 'bg-danger-subtle text-danger' },
}

interface EstadoBadgeProps {
  estado: EstadoDocumento
  className?: string
}

export function EstadoBadge({ estado, className }: EstadoBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
