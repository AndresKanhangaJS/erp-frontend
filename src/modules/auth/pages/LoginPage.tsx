import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/shared/components/ui/FormField'
import { applyApiErrorsToForm, getApiErrorMessage } from '@/shared/utils/mapApiErrors'
import { getTenantSlugFromHostname } from '@/shared/utils/tenantSlug'

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
 * Campo "ID do tenant": num subdomínio real (empresa.sistema.ao),
 * getTenantSlugFromHostname deriva-o sozinho e o campo nem aparece — o
 * X-Tenant-ID continua obrigatório no backend (ver docs/api-contract.md),
 * só deixa de precisar de input manual. Sem VITE_ROOT_DOMAIN configurado
 * (dev local) ou fora desse domínio, mantém-se o campo manual.
 *
 * O <Form {...form}> (FormProvider do RHF) é obrigatório aqui: o
 * FormField partilhado usa FormLabel/FormControl/FormMessage do
 * shadcn, que leem o estado do campo via useFormContext() — sem esta
 * envolvente, isso rebenta com "Cannot destructure property
 * 'getFieldState' of null" assim que a página tenta renderizar, e sem
 * ErrorBoundary a árvore React inteira desmonta (ecrã em branco).
 */
export default function LoginPage() {
  const [tenantSlug] = useState(() => getTenantSlugFromHostname())
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { tenantId: tenantSlug ?? '', email: '', password: '' },
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

          {tenantSlug ? (
            <p className="text-sm text-text-muted">
              A entrar em <span className="font-medium text-text-primary">{tenantSlug}</span>
            </p>
          ) : (
            <FormField
              control={control}
              name="tenantId"
              label="ID do tenant"
              description="Detectado automaticamente num subdomínio real — usa isto só em ambiente de suporte ou desenvolvimento."
              render={(field) => <Input autoComplete="off" {...field} />}
            />
          )}

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

          <div className="space-y-1.5 text-center text-sm">
            <Link to="/esqueci-password" className="block text-text-secondary hover:underline">
              Esqueci-me da password
            </Link>
            <Link to="/registar" className="block text-text-secondary hover:underline">
              Ainda não tens conta? Regista a tua empresa
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
