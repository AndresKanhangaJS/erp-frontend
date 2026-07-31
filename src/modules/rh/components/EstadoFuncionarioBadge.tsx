import { UserCheck, UserX, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoFuncionario } from '../types'

const CONFIG: Record<EstadoFuncionario, { label: string; className: string; icon: LucideIcon }> = {
  activo: { label: 'Activo', className: 'bg-success-subtle text-success', icon: UserCheck },
  inactivo: {
    label: 'Inactivo',
    className: 'bg-surface-raised text-text-secondary',
    icon: UserX,
  },
}

interface EstadoFuncionarioBadgeProps {
  estado: EstadoFuncionario
  className?: string
}

export function EstadoFuncionarioBadge({ estado, className }: EstadoFuncionarioBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
