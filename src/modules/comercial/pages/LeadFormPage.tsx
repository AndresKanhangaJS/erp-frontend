import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { ActividadesTimeline } from '../components/ActividadesTimeline'
import { useCriarLead } from '../hooks/useCriarLead'
import { useEditarLead } from '../hooks/useEditarLead'
import { useLead } from '../hooks/useLead'
import { leadSchema, type LeadFormValues } from '../schemas/leadSchema'

const ORIGEM_LABELS: Record<LeadFormValues['origem'], string> = {
  manual: 'Manual',
  website: 'Website',
  referencia: 'Referência',
  cold_call: 'Cold call',
}

const ESTADO_LABELS: Record<LeadFormValues['estado'], string> = {
  novo: 'Novo',
  contactado: 'Contactado',
  qualificado: 'Qualificado',
  desqualificado: 'Desqualificado',
}

function valorOuNull(value: string): string | null {
  return value === '' ? null : value
}

export default function LeadFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  const { data: lead, isLoading } = useLead(id)
  const criar = useCriarLead()
  const editar = useEditarLead(id ?? '')

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: '',
      empresa: null,
      email: null,
      telefone: null,
      origem: 'manual',
      estado: 'novo',
    },
  })

  useEffect(() => {
    if (lead) {
      reset({
        nome: lead.nome,
        empresa: lead.empresa,
        email: lead.email,
        telefone: lead.telefone,
        origem: lead.origem,
        estado: lead.estado,
      })
    }
  }, [lead, reset])

  if (isEdicao && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full max-w-xl" />
      </div>
    )
  }

  function onSubmit(values: LeadFormValues) {
    if (isEdicao) {
      editar.mutate(values, {
        onSuccess: () => navigate('/comercial/leads'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    } else {
      criar.mutate(values, {
        onSuccess: () => navigate('/comercial/leads'),
        onError: (error) => applyApiErrorsToForm(error, setError),
      })
    }
  }

  const aGuardar = criar.isPending || editar.isPending

  return (
    <div className="max-w-xl space-y-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <PageHeader
          title={isEdicao ? 'Editar lead' : 'Novo lead'}
          breadcrumbs={[
            { label: 'Comercial', href: '/comercial' },
            { label: 'Leads', href: '/comercial/leads' },
            { label: isEdicao ? 'Editar' : 'Novo' },
          ]}
          actions={
            <Button type="submit" disabled={isSubmitting || aGuardar}>
              {aGuardar ? 'A guardar...' : 'Guardar'}
            </Button>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="empresa" className="text-sm text-text-secondary">
              Empresa (opcional)
            </label>
            <Controller
              control={control}
              name="empresa"
              render={({ field }) => (
                <Input
                  id="empresa"
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(valorOuNull(event.target.value))}
                />
              )}
            />
          </div>

          {isEdicao ? (
            <div className="space-y-1">
              <label htmlFor="estado" className="text-sm text-text-secondary">
                Estado
              </label>
              <Controller
                control={control}
                name="estado"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="estado" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ESTADO_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label htmlFor="origem" className="text-sm text-text-secondary">
                Origem
              </label>
              <Controller
                control={control}
                name="origem"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="origem" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORIGEM_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                  onChange={(event) => field.onChange(valorOuNull(event.target.value))}
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
                  onChange={(event) => field.onChange(valorOuNull(event.target.value))}
                />
              )}
            />
          </div>
        </div>
      </form>

      {isEdicao && id && <ActividadesTimeline relacionadoTipo="lead" relacionadoId={id} />}
    </div>
  )
}
