import { useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useCliente } from '../hooks/useCliente'
import { useCriarCliente } from '../hooks/useCriarCliente'
import { useEditarCliente } from '../hooks/useEditarCliente'
import { clienteSchema, type ClienteFormValues } from '../schemas/clienteSchema'

/** Campos opcionais são "string | null", nunca "" — o schema não aceita string vazia. */
function valorOuNull(event: ChangeEvent<HTMLInputElement>): string | null {
  return event.target.value === '' ? null : event.target.value
}

export default function ClienteFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  const { data: cliente, isLoading } = useCliente(id)
  const criar = useCriarCliente()
  const editar = useEditarCliente(id ?? '')

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nome: '', nif: null, email: null, telefone: null, morada: null },
  })

  useEffect(() => {
    if (cliente) {
      reset(cliente)
    }
  }, [cliente, reset])

  if (isEdicao && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full max-w-xl" />
      </div>
    )
  }

  function onSubmit(values: ClienteFormValues) {
    if (isEdicao) {
      editar.mutate(values, {
        onSuccess: () => navigate('/faturacao/clientes'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    } else {
      criar.mutate(values, {
        onSuccess: () => navigate('/faturacao/clientes'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    }
  }

  const aGuardar = criar.isPending || editar.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title={isEdicao ? 'Editar cliente' : 'Novo cliente'}
        breadcrumbs={[
          { label: 'Facturação', href: '/faturacao' },
          { label: 'Clientes', href: '/faturacao/clientes' },
          { label: isEdicao ? 'Editar' : 'Novo' },
        ]}
        actions={
          <PermissionGuard permission={isEdicao ? 'faturacao.editar' : 'faturacao.criar'}>
            <Button type="submit" disabled={isSubmitting || aGuardar}>
              {aGuardar ? 'A guardar...' : 'Guardar'}
            </Button>
          </PermissionGuard>
        }
      />

      <div className="space-y-1">
        <label htmlFor="nome" className="text-sm text-text-secondary">
          Nome
        </label>
        <Controller
          control={control}
          name="nome"
          render={({ field }) => <Input id="nome" aria-invalid={!!errors.nome} {...field} />}
        />
        {errors.nome && <p className="text-sm text-danger">{errors.nome.message}</p>}
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
              aria-invalid={!!errors.nif}
              value={field.value ?? ''}
              onChange={(event) => field.onChange(valorOuNull(event))}
            />
          )}
        />
        {errors.nif && <p className="text-sm text-danger">{errors.nif.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-text-secondary">
          Email (opcional)
        </label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              value={field.value ?? ''}
              onChange={(event) => field.onChange(valorOuNull(event))}
            />
          )}
        />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="telefone" className="text-sm text-text-secondary">
          Telefone (opcional)
        </label>
        <Controller
          control={control}
          name="telefone"
          render={({ field }) => (
            <Input
              id="telefone"
              value={field.value ?? ''}
              onChange={(event) => field.onChange(valorOuNull(event))}
            />
          )}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="morada" className="text-sm text-text-secondary">
          Morada (opcional)
        </label>
        <Controller
          control={control}
          name="morada"
          render={({ field }) => (
            <Input
              id="morada"
              value={field.value ?? ''}
              onChange={(event) => field.onChange(valorOuNull(event))}
            />
          )}
        />
      </div>
    </form>
  )
}
