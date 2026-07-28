import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useModules } from '@/shared/hooks/useModules'
import { useUiStore } from '@/shared/stores/uiStore'

interface ModuleNavItem {
  slug: string
  label: string
  href: string
}

const MODULES: ModuleNavItem[] = [
  { slug: 'faturacao', label: 'Facturação', href: '/faturacao' },
  { slug: 'contabilidade', label: 'Contabilidade', href: '/contabilidade' },
  { slug: 'rh', label: 'RH', href: '/rh' },
  { slug: 'comercial', label: 'Comercial', href: '/comercial' },
  { slug: 'stock', label: 'Stock', href: '/stock' },
  { slug: 'relatorios', label: 'Relatórios', href: '/relatorios' },
]

/**
 * Módulos inactivos no plano do tenant não desaparecem — ficam com
 * badge "Pro" e apontam para a página de upgrade (ver ModuleGuard,
 * Passo 8). Usa <a> em vez de <Link> do react-router por agora: o
 * router só é montado no Passo 8, e <Link> fora de um Router rebenta.
 */
export function Sidebar() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const { isModuleActive } = useModules()

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-surface-card transition-[width] duration-150',
        sidebarOpen ? 'w-56' : 'w-14',
      )}
    >
      <nav className="flex-1 space-y-1 p-2" aria-label="Módulos">
        {MODULES.map((mod) => {
          const active = isModuleActive(mod.slug)
          return (
            <a
              key={mod.slug}
              href={active ? mod.href : '/planos'}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-accent hover:text-text-primary',
                !sidebarOpen && 'justify-center px-2',
              )}
              aria-label={active ? mod.label : `${mod.label} (requer upgrade de plano)`}
            >
              {sidebarOpen && <span>{mod.label}</span>}
              {sidebarOpen && !active && (
                <Badge className="bg-brand-accent-subtle text-brand-accent">Pro</Badge>
              )}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
