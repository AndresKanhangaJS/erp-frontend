import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useResetPassword } from '../hooks/useResetPassword'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/resetPasswordSchema'

/** Alcançada a partir do link enviado por email (PasswordResetMail, erp-api) — o token vem sempre na query string. */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { tenantId: '', password: '', passwordConfirmation: '' },
  })
  const resetPassword = useResetPassword()

  function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      return
    }
    resetPassword.mutate(
      { ...values, token },
      {
        onSuccess: () => navigate('/login', { replace: true }),
        onError: (error) => {
          setError('root', {
            message: getApiErrorMessage(error, 'Não foi possível repor a senha. Tenta novamente.'),
          })
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface-card p-6">
        <h1 className="text-lg font-semibold text-text-primary">Repor password</h1>

        {!token ? (
          <p className="text-sm text-danger">
            Link inválido — falta o código de reposição. Pede um novo link em{' '}
            <Link to="/esqueci-password" className="underline">
              recuperar password
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="tenantId" className="text-sm text-text-secondary">
                ID do tenant
              </label>
              <Controller
                control={control}
                name="tenantId"
                render={({ field }) => (
                  <Input
                    id="tenantId"
                    autoComplete="off"
                    aria-invalid={!!errors.tenantId}
                    {...field}
                  />
                )}
              />
              {errors.tenantId && <p className="text-sm text-danger">{errors.tenantId.message}</p>}
              <p className="text-xs text-text-muted">
                Temporário — substituído por resolução automática mais tarde.
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-text-secondary">
                Nova senha
              </label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    {...field}
                  />
                )}
              />
              {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
              <p className="text-xs text-text-muted">
                Mínimo 10 caracteres, com maiúscula, minúscula, número e símbolo.
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="passwordConfirmation" className="text-sm text-text-secondary">
                Confirmar nova senha
              </label>
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.passwordConfirmation}
                    {...field}
                  />
                )}
              />
              {errors.passwordConfirmation && (
                <p className="text-sm text-danger">{errors.passwordConfirmation.message}</p>
              )}
            </div>

            {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || resetPassword.isPending}
            >
              {resetPassword.isPending ? 'A repor...' : 'Repor password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
