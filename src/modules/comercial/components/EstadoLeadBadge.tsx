import { CircleDot, MessageCircle, ThumbsDown, UserCheck, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoLead } from '../types'

const CONFIG: Record<EstadoLead, { label: string; className: string; icon: LucideIcon }> = {
  novo: { label: 'Novo', className: 'bg-info-subtle text-info', icon: CircleDot },
  contactado: {
    label: 'Contactado',
    className: 'bg-warning-subtle text-warning',
    icon: MessageCircle,
  },
  qualificado: {
    label: 'Qualificado',
    className: 'bg-success-subtle text-success',
    icon: UserCheck,
  },
  desqualificado: {
    label: 'Desqualificado',
    className: 'bg-surface-raised text-text-secondary',
    icon: ThumbsDown,
  },
}

interface EstadoLeadBadgeProps {
  estado: EstadoLead
  className?: string
}

export function EstadoLeadBadge({ estado, className }: EstadoLeadBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
