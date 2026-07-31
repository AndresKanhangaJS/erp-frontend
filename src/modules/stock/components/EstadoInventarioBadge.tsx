import { ClipboardCheck, ClipboardList, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoInventario } from '../types'

const CONFIG: Record<EstadoInventario, { label: string; className: string; icon: LucideIcon }> = {
  aberto: { label: 'Aberto', className: 'bg-success-subtle text-success', icon: ClipboardList },
  fechado: {
    label: 'Fechado',
    className: 'bg-surface-raised text-text-secondary',
    icon: ClipboardCheck,
  },
}

interface EstadoInventarioBadgeProps {
  estado: EstadoInventario
  className?: string
}

export function EstadoInventarioBadge({ estado, className }: EstadoInventarioBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
