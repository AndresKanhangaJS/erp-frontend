import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoFolhaSalarial } from '../types'

const CONFIG: Record<EstadoFolhaSalarial, { label: string; className: string }> = {
  processada: { label: 'Processada', className: 'bg-success-subtle text-success' },
  anulada: { label: 'Anulada', className: 'bg-danger-subtle text-danger' },
}

interface EstadoFolhaBadgeProps {
  estado: EstadoFolhaSalarial
  className?: string
}

export function EstadoFolhaBadge({ estado, className }: EstadoFolhaBadgeProps) {
  const config = CONFIG[estado]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
