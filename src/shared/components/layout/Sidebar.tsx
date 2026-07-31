import {
  BarChart3,
  Boxes,
  Calculator,
  Handshake,
  Receipt,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useModules } from '@/shared/hooks/useModules'
import { useUiStore } from '@/shared/stores/uiStore'

interface ModuleNavItem {
  slug: string
  label: string
  href: string
  icon: LucideIcon
}

const MODULES: ModuleNavItem[] = [
  { slug: 'faturacao', label: 'Facturação', href: '/faturacao', icon: Receipt },
  { slug: 'contabilidade', label: 'Contabilidade', href: '/contabilidade', icon: Calculator },
  { slug: 'rh', label: 'RH', href: '/rh', icon: Users },
  { slug: 'comercial', label: 'Comercial', href: '/comercial', icon: Handshake },
  { slug: 'stock', label: 'Stock', href: '/stock', icon: Boxes },
  { slug: 'relatorios', label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
]

/** Módulos inactivos no plano do tenant não desaparecem — ficam com badge "Pro" e apontam para a página de upgrade (ver ModuleGuard). */
export function Sidebar() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const { isModuleActive } = useModules()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-surface-card transition-[width] duration-150',
        sidebarOpen ? 'w-56' : 'w-14',
      )}
    >
      <nav className="flex-1 space-y-0.5 p-2" aria-label="Módulos">
        {MODULES.map((mod) => {
          const active = isModuleActive(mod.slug)
          const isCurrent = active && location.pathname.startsWith(mod.href)
          const Icon = mod.icon
          return (
            <Link
              key={mod.slug}
              to={active ? mod.href : '/planos'}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isCurrent
                  ? 'bg-brand-accent-subtle text-brand-accent'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                !sidebarOpen && 'justify-center px-2',
              )}
              aria-label={active ? mod.label : `${mod.label} (requer upgrade de plano)`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {sidebarOpen && <span className="flex-1">{mod.label}</span>}
              {sidebarOpen && !active && (
                <Badge className="bg-brand-accent-subtle text-brand-accent">Pro</Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
