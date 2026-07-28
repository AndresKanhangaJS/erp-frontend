import { Lock } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { EmptyState } from '@/shared/components/layout/EmptyState'
import { PageHeader } from '@/shared/components/layout/PageHeader'

const MODULE_LABELS: Record<string, string> = {
  faturacao: 'Facturação',
  contabilidade: 'Contabilidade',
  rh: 'RH',
  comercial: 'Comercial',
  stock: 'Stock',
  relatorios: 'Relatórios',
}

export function UpgradePage() {
  const [searchParams] = useSearchParams()
  const moduleSlug = searchParams.get('modulo')
  const moduleLabel = moduleSlug ? (MODULE_LABELS[moduleSlug] ?? moduleSlug) : null

  return (
    <div className="space-y-6">
      <PageHeader title="Actualizar plano" />
      <EmptyState
        icon={Lock}
        title={
          moduleLabel
            ? `O módulo "${moduleLabel}" não está incluído no teu plano`
            : 'Módulo não disponível no teu plano'
        }
        description="Contacta o teu gestor de conta para actualizares o plano e desbloqueares este módulo."
      />
    </div>
  )
}
