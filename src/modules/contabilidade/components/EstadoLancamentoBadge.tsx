import { Ban, CheckCircle2, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoLancamento } from '../types'

const CONFIG: Record<EstadoLancamento, { label: string; className: string; icon: LucideIcon }> = {
  lancado: { label: 'Lançado', className: 'bg-success-subtle text-success', icon: CheckCircle2 },
  anulado: { label: 'Anulado', className: 'bg-danger-subtle text-danger', icon: Ban },
}

interface EstadoLancamentoBadgeProps {
  estado: EstadoLancamento
  className?: string
}

export function EstadoLancamentoBadge({ estado, className }: EstadoLancamentoBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
