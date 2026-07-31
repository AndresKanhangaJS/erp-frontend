import { Ban, CheckCircle2, CircleDollarSign, FileEdit, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoFatura } from '../types'

const CONFIG: Record<EstadoFatura, { label: string; className: string; icon: LucideIcon }> = {
  rascunho: {
    label: 'Rascunho',
    className: 'bg-surface-raised text-text-secondary',
    icon: FileEdit,
  },
  emitida: { label: 'Emitida', className: 'bg-success-subtle text-success', icon: CheckCircle2 },
  paga: { label: 'Paga', className: 'bg-info-subtle text-info', icon: CircleDollarSign },
  anulada: { label: 'Anulada', className: 'bg-danger-subtle text-danger', icon: Ban },
}

interface EstadoBadgeProps {
  estado: EstadoFatura
  className?: string
}

export function EstadoBadge({ estado, className }: EstadoBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
