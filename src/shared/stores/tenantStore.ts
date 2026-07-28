import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TenantState {
  tenantId: string | null
  plan: string | null
  activeModules: string[]
  setTenant: (params: { tenantId: string; plan: string; activeModules: string[] }) => void
  clearTenant: () => void
}

/**
 * Persistida em localStorage — o interceptor do axios (src/api/client.ts)
 * lê o tenantId daqui para o cabeçalho X-Tenant-ID em cada pedido.
 */
export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantId: null,
      plan: null,
      activeModules: [],
      setTenant: ({ tenantId, plan, activeModules }) => set({ tenantId, plan, activeModules }),
      clearTenant: () => set({ tenantId: null, plan: null, activeModules: [] }),
    }),
    { name: 'erp-tenant' },
  ),
)
