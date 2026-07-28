import type { ReactNode } from 'react'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  actions?: ReactNode
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Localização actual" className="mb-1 text-sm text-text-muted">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 && <span className="mx-1.5">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-text-primary hover:underline">
                    {crumb.label}
                  </a>
                ) : (
                  crumb.label
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
