import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoLead } from '../types'

const CONFIG: Record<EstadoLead, { label: string; className: string }> = {
  novo: { label: 'Novo', className: 'bg-info-subtle text-info' },
  contactado: { label: 'Contactado', className: 'bg-warning-subtle text-warning' },
  qualificado: { label: 'Qualificado', className: 'bg-success-subtle text-success' },
  desqualificado: { label: 'Desqualificado', className: 'bg-surface-raised text-text-secondary' },
}

interface EstadoLeadBadgeProps {
  estado: EstadoLead
  className?: string
}

export function EstadoLeadBadge({ estado, className }: EstadoLeadBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
