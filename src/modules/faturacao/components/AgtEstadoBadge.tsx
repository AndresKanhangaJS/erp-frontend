import {
  AlertTriangle,
  Ban,
  Clock,
  MinusCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Upload,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { AgtEstadoSubmissao } from '../types'

const CONFIG: Record<AgtEstadoSubmissao, { label: string; className: string; icon: LucideIcon }> = {
  nao_aplicavel: {
    label: 'AGT não aplicável',
    className: 'bg-surface-raised text-text-secondary',
    icon: MinusCircle,
  },
  pendente: { label: 'Pendente na AGT', className: 'bg-warning-subtle text-warning', icon: Clock },
  submetida: { label: 'Submetida à AGT', className: 'bg-info-subtle text-info', icon: Upload },
  valida: {
    label: 'Válida na AGT',
    className: 'bg-success-subtle text-success',
    icon: ShieldCheck,
  },
  invalida: {
    label: 'Inválida na AGT',
    className: 'bg-danger-subtle text-danger',
    icon: ShieldAlert,
  },
  anulada_agt: {
    label: 'Anulada na AGT',
    className: 'bg-surface-raised text-text-secondary',
    icon: Ban,
  },
  substituida: {
    label: 'Substituída na AGT',
    className: 'bg-info-subtle text-info',
    icon: RefreshCw,
  },
  erro: { label: 'Erro na AGT', className: 'bg-danger-subtle text-danger', icon: AlertTriangle },
}

interface AgtEstadoBadgeProps {
  estado: AgtEstadoSubmissao
  className?: string
}

export function AgtEstadoBadge({ estado, className }: AgtEstadoBadgeProps) {
  const config = CONFIG[estado]
  const Icon = config.icon
  return (
    <Badge className={cn('gap-1', config.className, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
