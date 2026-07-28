import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/shared/components/ui/FormField'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useLogin } from '../hooks/useLogin'

const loginSchema = z.object({
  email: z.string().min(1, 'O email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória'),
})

type LoginFormValues = z.infer<typeof loginSchema>

/**
 * Validação Zod aqui é só UX — o backend valida sempre (ADR-004).
 */
export default function LoginPage() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const login = useLogin()

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onError: (error) => {
        if (!applyApiErrorsToForm(error, setError)) {
          setError('root', { message: 'Credenciais inválidas. Tenta novamente.' })
        }
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface-card p-6"
        noValidate
      >
        <h1 className="text-lg font-semibold text-text-primary">Entrar</h1>

        <FormField
          control={control}
          name="email"
          label="Email"
          render={(field) => <Input type="email" autoComplete="email" {...field} />}
        />

        <FormField
          control={control}
          name="password"
          label="Palavra-passe"
          render={(field) => <Input type="password" autoComplete="current-password" {...field} />}
        />

        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting || login.isPending}>
          {login.isPending ? 'A entrar...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
