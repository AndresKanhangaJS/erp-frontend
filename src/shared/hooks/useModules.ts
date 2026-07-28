import { useTenantStore } from '@/shared/stores/tenantStore'

export function isModuleActive(activeModules: string[], moduleSlug: string): boolean {
  return activeModules.includes(moduleSlug)
}

/**
 * Módulos inactivos no tenant não desaparecem da sidebar — ficam com
 * badge "Pro" e levam a uma página de upgrade (ver ModuleGuard, Passo 8).
 */
export function useModules() {
  const activeModules = useTenantStore((state) => state.activeModules)
  return {
    activeModules,
    isModuleActive: (moduleSlug: string) => isModuleActive(activeModules, moduleSlug),
  }
}
