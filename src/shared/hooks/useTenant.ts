import { useShallow } from 'zustand/react/shallow'

import { useTenantStore } from '@/shared/stores/tenantStore'

export function useTenant() {
  return useTenantStore(
    useShallow((state) => ({
      tenantId: state.tenantId,
      plan: state.plan,
      setTenant: state.setTenant,
      clearTenant: state.clearTenant,
    })),
  )
}
