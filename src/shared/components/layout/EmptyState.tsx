import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Icon className="h-8 w-8 text-text-muted" aria-hidden="true" />
      <p className="font-medium text-text-primary">{title}</p>
      {description && <p className="text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  )
}
