import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getApiErrorMessage } from '@/shared/utils/mapApiErrors'

import { useRegisterTenant } from '../hooks/useRegisterTenant'
import {
  registerTenantSchema,
  type RegisterTenantFormValues,
} from '../schemas/registerTenantSchema'

const PLANOS = [
  { codigo: 'starter', nome: 'Starter', preco: '15.000 Kz/mês', modulos: 'Facturação' },
  {
    codigo: 'growth',
    nome: 'Growth',
    preco: '35.000 Kz/mês',
    modulos: 'Facturação, Contabilidade, RH',
  },
  {
    codigo: 'pro',
    nome: 'Pro',
    preco: '65.000 Kz/mês',
    modulos: 'Todos os módulos',
  },
] as const

function valorOuNull(value: string): string | null {
  return value === '' ? null : value
}

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterTenantFormValues>({
    resolver: zodResolver(registerTenantSchema),
    defaultValues: {
      nomeEmpresa: '',
      nif: null,
      adminNome: '',
      adminEmail: '',
      adminPassword: '',
      adminPasswordConfirmation: '',
      plano: 'starter',
    },
  })
  const registrar = useRegisterTenant()

  function onSubmit(values: RegisterTenantFormValues) {
    registrar.mutate(values, {
      onError: (error) => {
        setError('root', {
          message: getApiErrorMessage(error, 'Não foi possível criar a conta. Tenta novamente.'),
        })
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-md space-y-5 rounded-lg border border-border bg-surface-card p-6"
      >
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-text-primary">Criar conta</h1>
          <p className="text-sm text-text-secondary">14 dias de acesso, sem cartão de crédito.</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="nomeEmpresa" className="text-sm text-text-secondary">
            Nome da empresa
          </label>
          <Controller
            control={control}
            name="nomeEmpresa"
            render={({ field }) => (
              <Input id="nomeEmpresa" aria-invalid={!!errors.nomeEmpresa} {...field} />
            )}
          />
          {errors.nomeEmpresa && (
            <p className="text-sm text-danger">{errors.nomeEmpresa.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="nif" className="text-sm text-text-secondary">
            NIF (opcional)
          </label>
          <Controller
            control={control}
            name="nif"
            render={({ field }) => (
              <Input
                id="nif"
                value={field.value ?? ''}
                onChange={(event) => field.onChange(valorOuNull(event.target.value))}
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="adminNome" className="text-sm text-text-secondary">
            O teu nome
          </label>
          <Controller
            control={control}
            name="adminNome"
            render={({ field }) => (
              <Input id="adminNome" aria-invalid={!!errors.adminNome} {...field} />
            )}
          />
          {errors.adminNome && <p className="text-sm text-danger">{errors.adminNome.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="adminEmail" className="text-sm text-text-secondary">
            Email
          </label>
          <Controller
            control={control}
            name="adminEmail"
            render={({ field }) => (
              <Input
                id="adminEmail"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.adminEmail}
                {...field}
              />
            )}
          />
          {errors.adminEmail && <p className="text-sm text-danger">{errors.adminEmail.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="adminPassword" className="text-sm text-text-secondary">
              Password
            </label>
            <Controller
              control={control}
              name="adminPassword"
              render={({ field }) => (
                <Input
                  id="adminPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.adminPassword}
                  {...field}
                />
              )}
            />
            {errors.adminPassword && (
              <p className="text-sm text-danger">{errors.adminPassword.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="adminPasswordConfirmation" className="text-sm text-text-secondary">
              Confirmar
            </label>
            <Controller
              control={control}
              name="adminPasswordConfirmation"
              render={({ field }) => (
                <Input
                  id="adminPasswordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.adminPasswordConfirmation}
                  {...field}
                />
              )}
            />
            {errors.adminPasswordConfirmation && (
              <p className="text-sm text-danger">{errors.adminPasswordConfirmation.message}</p>
            )}
          </div>
        </div>
        <p className="-mt-3 text-xs text-text-muted">
          Mínimo 10 caracteres, com maiúscula, minúscula, número e símbolo.
        </p>

        <div className="space-y-1">
          <label htmlFor="plano" className="text-sm text-text-secondary">
            Plano
          </label>
          <Controller
            control={control}
            name="plano"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="plano" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLANOS.map((plano) => (
                    <SelectItem key={plano.codigo} value={plano.codigo}>
                      {plano.nome} — {plano.preco} ({plano.modulos})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting || registrar.isPending}>
          {registrar.isPending ? 'A criar conta...' : 'Criar conta'}
        </Button>

        <Link to="/login" className="block text-center text-sm text-text-secondary hover:underline">
          Já tenho conta — entrar
        </Link>
      </form>
    </div>
  )
}
