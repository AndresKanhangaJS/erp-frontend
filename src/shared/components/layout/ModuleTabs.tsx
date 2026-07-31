import { NavLink } from 'react-router'

import { cn } from '@/lib/utils'

export interface ModuleTabsItem {
  label: string
  href: string
  /** Passa a "end" do NavLink — precisa de true na rota índice do módulo, senão fica sempre activa. */
  end?: boolean
}

interface ModuleTabsProps {
  items: ModuleTabsItem[]
}

/**
 * Navegação persistente entre as secções de um módulo (ex.: Facturas,
 * Clientes, Artigos dentro de Facturação) — sem isto, páginas que só
 * são alcançáveis por link a partir de outra página (ou por URL directo)
 * ficam invisíveis para quem navega só pela Sidebar.
 */
export function ModuleTabs({ items }: ModuleTabsProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-2" aria-label="Secções">
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-brand-accent-subtle text-brand-accent'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
