import { Ban, CheckCircle2, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoFolhaSalarial } from '../types'

const CONFIG: Record<EstadoFolhaSalarial, { label: string; className: string; icon: LucideIcon }> =
  {
    processada: {
      label: 'Processada',
      className: 'bg-success-subtle text-success',
      icon: CheckCircle2,
    },
    anulada: { label: 'Anulada', className: 'bg-danger-subtle text-danger', icon: Ban },
  }

interface EstadoFolhaBadgeProps {
  estado: EstadoFolhaSalarial
  className?: string
}

export function EstadoFolhaBadge({ estado, className }: EstadoFolhaBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
