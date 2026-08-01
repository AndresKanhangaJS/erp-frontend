import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/shared/components/ui/FormField'
import { getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useForgotPassword } from '../hooks/useForgotPassword'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../schemas/forgotPasswordSchema'

export default function ForgotPasswordPage() {
  const [enviado, setEnviado] = useState(false)
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { tenantId: '', email: '' },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form
  const forgotPassword = useForgotPassword()

  function onSubmit(values: ForgotPasswordFormValues) {
    forgotPassword.mutate(values, {
      onSuccess: () => setEnviado(true),
      onError: (error) => {
        setError('root', {
          message: getApiErrorMessage(
            error,
            'Não foi possível processar o pedido. Tenta novamente.',
          ),
        })
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface-card p-6">
        <h1 className="text-lg font-semibold text-text-primary">Recuperar password</h1>

        {enviado ? (
          <p className="text-sm text-text-secondary">
            Se o email existir, vais receber instruções para repores a senha em breve.
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <FormField
                control={control}
                name="tenantId"
                label="ID do tenant"
                description="Temporário — substituído por resolução automática mais tarde."
                render={(field) => <Input autoComplete="off" {...field} />}
              />

              <FormField
                control={control}
                name="email"
                label="Email"
                render={(field) => <Input type="email" autoComplete="email" {...field} />}
              />

              {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || forgotPassword.isPending}
              >
                {forgotPassword.isPending ? 'A enviar...' : 'Enviar instruções'}
              </Button>
            </form>
          </Form>
        )}

        <Link to="/login" className="block text-center text-sm text-text-secondary hover:underline">
          Voltar ao login
        </Link>
      </div>
    </div>
  )
}
