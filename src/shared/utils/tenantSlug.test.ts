import { describe, expect, it } from 'vitest'

import { getTenantSlugFromHostname } from './tenantSlug'

describe('getTenantSlugFromHostname', () => {
  it('extrai o slug do subdominio', () => {
    expect(getTenantSlugFromHostname('empresa.sistema.ao', 'sistema.ao')).toBe('empresa')
  })

  it('devolve null sem rootDomain configurado', () => {
    expect(getTenantSlugFromHostname('empresa.sistema.ao', undefined)).toBeNull()
  })

  it('devolve null no dominio apex, sem subdominio', () => {
    expect(getTenantSlugFromHostname('sistema.ao', 'sistema.ao')).toBeNull()
  })

  it('devolve null fora do rootDomain (dev local)', () => {
    expect(getTenantSlugFromHostname('localhost', 'sistema.ao')).toBeNull()
  })

  it('devolve null para subdominios reservados', () => {
    expect(getTenantSlugFromHostname('www.sistema.ao', 'sistema.ao')).toBeNull()
    expect(getTenantSlugFromHostname('app.sistema.ao', 'sistema.ao')).toBeNull()
    expect(getTenantSlugFromHostname('api.sistema.ao', 'sistema.ao')).toBeNull()
  })

  it('devolve null para subdominios de segundo nivel', () => {
    expect(getTenantSlugFromHostname('empresa.staging.sistema.ao', 'sistema.ao')).toBeNull()
  })
})
