import { Lock, LockOpen } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface EstadoPeriodoBadgeProps {
  fechado: boolean
  className?: string
}

export function EstadoPeriodoBadge({ fechado, className }: EstadoPeriodoBadgeProps) {
  const Icon = fechado ? Lock : LockOpen
  return (
    <Badge
      className={cn(
        'gap-1',
        fechado ? 'bg-surface-raised text-text-secondary' : 'bg-success-subtle text-success',
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {fechado ? 'Fechado' : 'Aberto'}
    </Badge>
  )
}
