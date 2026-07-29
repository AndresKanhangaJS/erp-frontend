import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/shared/components/ui/FormField'
import { applyApiErrorsToForm, getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useLogin } from '../hooks/useLogin'

const loginSchema = z.object({
  tenantId: z.string().min(1, 'O ID do tenant é obrigatório'),
  email: z.string().min(1, 'O email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'A palavra-passe é obrigatória'),
})

type LoginFormValues = z.infer<typeof loginSchema>

/**
 * Validação Zod aqui é só UX — o backend valida sempre (ADR-004).
 *
 * Campo "ID do tenant": solução interina — ainda não há resolução de
 * tenant por subdomínio nem um passo de "descobrir o tenant pelo
 * email" no backend, e o X-Tenant-ID é obrigatório mesmo no login
 * (ver docs/api-contract.md). Substituir isto assim que existir um
 * mecanismo real de resolução.
 *
 * O <Form {...form}> (FormProvider do RHF) é obrigatório aqui: o
 * FormField partilhado usa FormLabel/FormControl/FormMessage do
 * shadcn, que leem o estado do campo via useFormContext() — sem esta
 * envolvente, isso rebenta com "Cannot destructure property
 * 'getFieldState' of null" assim que a página tenta renderizar, e sem
 * ErrorBoundary a árvore React inteira desmonta (ecrã em branco).
 */
export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { tenantId: '', email: '', password: '' },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form
  const login = useLogin()

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onError: (error) => {
        if (!applyApiErrorsToForm(error, setError)) {
          setError('root', {
            message: getApiErrorMessage(error, 'Não foi possível entrar. Tenta novamente.'),
          })
        }
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface-card p-6"
          noValidate
        >
          <h1 className="text-lg font-semibold text-text-primary">Entrar</h1>

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
      </Form>
    </div>
  )
}
