import { toast } from 'sonner'

import { PageHeader } from '@/shared/components/layout/PageHeader'
import { useAuth } from '@/shared/hooks/useAuth'
import { ChangePasswordForm } from '@/modules/auth/components/ChangePasswordForm'

export function PerfilPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-sm space-y-8">
      <PageHeader title="Perfil" />

      <div className="space-y-1">
        <p className="text-sm text-text-secondary">Nome</p>
        <p className="font-medium text-text-primary">{user?.name}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-text-secondary">Email</p>
        <p className="font-medium text-text-primary">{user?.email}</p>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h2 className="text-sm font-semibold text-text-primary">Mudar password</h2>
        <ChangePasswordForm onSuccess={() => toast.success('Password alterada.')} />
      </div>
    </div>
  )
}
