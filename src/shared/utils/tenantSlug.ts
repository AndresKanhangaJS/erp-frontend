const RESERVED_SUBDOMAINS = new Set(['www', 'app', 'api'])

/**
 * Deriva o slug do tenant a partir do subdomínio da SPA (empresa.sistema.ao
 * → "empresa"). Sem rootDomain configurado (dev local, staging genérico)
 * ou fora desse domínio, devolve null — quem chamar cai para o campo
 * manual de "ID do tenant" (ver EnsureTenantIsResolved, erp-api, que
 * aceita UUID ou slug no mesmo cabeçalho X-Tenant-ID).
 */
export function getTenantSlugFromHostname(
  hostname: string = window.location.hostname,
  rootDomain: string | undefined = import.meta.env.VITE_ROOT_DOMAIN as string | undefined,
): string | null {
  if (!rootDomain || hostname === rootDomain) {
    return null
  }

  const suffix = `.${rootDomain}`
  if (!hostname.endsWith(suffix)) {
    return null
  }

  const slug = hostname.slice(0, -suffix.length)
  if (!slug || slug.includes('.') || RESERVED_SUBDOMAINS.has(slug)) {
    return null
  }

  return slug
}
