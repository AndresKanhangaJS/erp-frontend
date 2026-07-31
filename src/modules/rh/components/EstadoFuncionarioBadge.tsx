import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoFuncionario } from '../types'

const CONFIG: Record<EstadoFuncionario, { label: string; className: string }> = {
  activo: { label: 'Activo', className: 'bg-success-subtle text-success' },
  inactivo: { label: 'Inactivo', className: 'bg-surface-raised text-text-secondary' },
}

interface EstadoFuncionarioBadgeProps {
  estado: EstadoFuncionario
  className?: string
}

export function EstadoFuncionarioBadge({ estado, className }: EstadoFuncionarioBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
