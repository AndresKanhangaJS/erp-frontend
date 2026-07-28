import type { ReactNode } from 'react'

import { useUiStore } from '@/shared/stores/uiStore'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  return (
    <div className="flex h-screen bg-surface-page">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
