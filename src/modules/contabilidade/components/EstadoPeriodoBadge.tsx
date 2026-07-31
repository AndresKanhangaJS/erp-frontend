import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface EstadoPeriodoBadgeProps {
  fechado: boolean
  className?: string
}

export function EstadoPeriodoBadge({ fechado, className }: EstadoPeriodoBadgeProps) {
  return (
    <Badge
      className={cn(
        fechado ? 'bg-surface-raised text-text-secondary' : 'bg-success-subtle text-success',
        className,
      )}
    >
      {fechado ? 'Fechado' : 'Aberto'}
    </Badge>
  )
}
