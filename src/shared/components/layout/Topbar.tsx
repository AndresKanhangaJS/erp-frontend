import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/shared/hooks/useAuth'
import { useTenant } from '@/shared/hooks/useTenant'

interface TopbarProps {
  onToggleSidebar: () => void
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user, logout } = useAuth()
  const { tenantId } = useTenant()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-card px-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Alternar menu lateral"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>
        {tenantId && <span className="text-sm text-text-muted">Tenant: {tenantId}</span>}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost">
            <span className="text-sm">{user?.name ?? 'Utilizador'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={logout}>Terminar sessão</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
