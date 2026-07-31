import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoInventario } from '../types'

const CONFIG: Record<EstadoInventario, { label: string; className: string }> = {
  aberto: { label: 'Aberto', className: 'bg-success-subtle text-success' },
  fechado: { label: 'Fechado', className: 'bg-surface-raised text-text-secondary' },
}

interface EstadoInventarioBadgeProps {
  estado: EstadoInventario
  className?: string
}

export function EstadoInventarioBadge({ estado, className }: EstadoInventarioBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
