import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatCardTone = 'accent' | 'success' | 'warning' | 'danger' | 'info'

/** Classes completas e literais de propósito — o Tailwind JIT não detecta `bg-${tone}-subtle` construído em runtime. */
const TONE_CLASSES: Record<StatCardTone, string> = {
  accent: 'bg-brand-accent-subtle text-brand-accent',
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  danger: 'bg-danger-subtle text-danger',
  info: 'bg-info-subtle text-info',
}

interface StatCardProps {
  label: string
  value: ReactNode
  icon: LucideIcon
  tone?: StatCardTone
  hint?: string
  className?: string
}

/** Cartão de resumo (contagem, total, indicador) — usa cor só para reforçar o significado do tone, nunca decorativa. */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'accent',
  hint,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            TONE_CLASSES[tone],
          )}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="truncate text-xl font-semibold text-text-primary">{value}</p>
          {hint && <p className="text-xs text-text-muted">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
