import { AlertTriangle, CheckCircle2, Clock, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { EstadoComunicacaoAgt } from '../types'

interface AgtConfig {
  label: string
  icon: LucideIcon
  className: string
}

const CONFIG: Record<EstadoComunicacaoAgt, AgtConfig> = {
  comunicado: {
    label: 'Certificado AGT',
    icon: CheckCircle2,
    className: 'border border-agt/30 bg-surface-raised text-agt',
  },
  pendente: {
    label: 'A comunicar à AGT',
    icon: Clock,
    className: 'bg-warning-subtle text-warning',
  },
  erro: {
    label: 'Erro de comunicação AGT',
    icon: AlertTriangle,
    className: 'bg-danger-subtle text-danger',
  },
}

interface CertificacaoAgtBadgeProps {
  estado: EstadoComunicacaoAgt
  className?: string
}

/** "Badge visível Certificado AGT" nos documentos emitidos — exigência da facturação electrónica. */
export function CertificacaoAgtBadge({ estado, className }: CertificacaoAgtBadgeProps) {
  const { label, icon: Icon, className: variantClassName } = CONFIG[estado]
  return (
    <Badge className={cn('gap-1', variantClassName, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </Badge>
  )
}
