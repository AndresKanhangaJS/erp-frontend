import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { applyApiErrorsToForm, getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useChangePassword } from '../hooks/useChangePassword'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../schemas/changePasswordSchema'

interface ChangePasswordFormProps {
  onSuccess: () => void
  submitLabel?: string
}

export function ChangePasswordForm({
  onSuccess,
  submitLabel = 'Trocar password',
}: ChangePasswordFormProps) {
  const trocar = useChangePassword()

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', password: '', passwordConfirmation: '' },
  })

  function onSubmit(values: ChangePasswordFormValues) {
    trocar.mutate(values, {
      onSuccess: () => {
        reset()
        onSuccess()
      },
      onError: (error) => {
        if (!applyApiErrorsToForm(error, setError)) {
          setError('root', {
            message: getApiErrorMessage(error, 'Não foi possível trocar a senha. Tenta novamente.'),
          })
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="currentPassword" className="text-sm text-text-secondary">
          Senha actual
        </label>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field }) => (
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.currentPassword}
              {...field}
            />
          )}
        />
        {errors.currentPassword && (
          <p className="text-sm text-danger">{errors.currentPassword.message}</p>
        )}
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

      <Button type="submit" className="w-full" disabled={isSubmitting || trocar.isPending}>
        {trocar.isPending ? 'A trocar...' : submitLabel}
      </Button>
    </form>
  )
}
