import { useNavigate } from 'react-router'

import { ChangePasswordForm } from '../components/ChangePasswordForm'

/**
 * Alcançada de duas formas: redirect pós-login quando must_change_password
 * é verdadeiro (useLogin.ts), ou redirect a meio da sessão vindo do
 * interceptor do axios quando qualquer pedido devolve 403
 * PASSWORD_CHANGE_REQUIRED (api/client.ts) — o backend bloqueia todos
 * os outros endpoints enquanto a flag estiver activa.
 */
export default function ChangePasswordPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface-card p-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-text-primary">Troca de password necessária</h1>
          <p className="text-sm text-text-secondary">
            Por razões de segurança, tens de definir uma nova password antes de continuar.
          </p>
        </div>

        <ChangePasswordForm onSuccess={() => navigate('/', { replace: true })} />
      </div>
    </div>
  )
}
