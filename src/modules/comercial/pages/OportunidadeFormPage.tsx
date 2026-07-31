import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { LeadCombobox } from '../components/LeadCombobox'
import { useCriarOportunidade } from '../hooks/useCriarOportunidade'
import { oportunidadeSchema, type OportunidadeFormValues } from '../schemas/oportunidadeSchema'
import type { Lead } from '../types'

/** Não há edição — só criação e mudança de estágio (ver DetalheOportunidadePage). */
export default function OportunidadeFormPage() {
  const navigate = useNavigate()
  const criar = useCriarOportunidade()
  const [lead, setLead] = useState<Lead | null>(null)

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OportunidadeFormValues>({
    resolver: zodResolver(oportunidadeSchema),
    defaultValues: {
      leadId: '',
      titulo: '',
      valorEstimado: 0,
      probabilidade: null,
      pipelineEstagioId: null,
      dataFechoPrevista: null,
    },
  })

  function onSubmit(values: OportunidadeFormValues) {
    criar.mutate(values, {
      onSuccess: (oportunidade) => navigate(`/comercial/oportunidades/${oportunidade.id}`),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title="Nova oportunidade"
        breadcrumbs={[
          { label: 'Comercial', href: '/comercial' },
          { label: 'Oportunidades', href: '/comercial/oportunidades' },
          { label: 'Nova' },
        ]}
        actions={
          <Button type="submit" disabled={isSubmitting || criar.isPending}>
            {criar.isPending ? 'A criar...' : 'Criar'}
          </Button>
        }
      />

      <div className="space-y-1">
        <label htmlFor="lead" className="text-sm text-text-secondary">
          Lead
        </label>
        <LeadCombobox
          id="lead"
          value={lead}
          onChange={(next) => {
            setLead(next)
            setValue('leadId', next?.id ?? '', { shouldValidate: true })
          }}
        />
        {errors.leadId && <p className="text-sm text-danger">{errors.leadId.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="titulo" className="text-sm text-text-secondary">
          Título
        </label>
        <Controller
          control={control}
          name="titulo"
          render={({ field }) => <Input id="titulo" aria-invalid={!!errors.titulo} {...field} />}
        />
        {errors.titulo && <p className="text-sm text-danger">{errors.titulo.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="valorEstimado" className="text-sm text-text-secondary">
            Valor estimado
          </label>
          <Controller
            control={control}
            name="valorEstimado"
            render={({ field }) => (
              <Input
                id="valorEstimado"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.valorEstimado}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
          {errors.valorEstimado && (
            <p className="text-sm text-danger">{errors.valorEstimado.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="probabilidade" className="text-sm text-text-secondary">
            Probabilidade % (opcional)
          </label>
          <Controller
            control={control}
            name="probabilidade"
            render={({ field }) => (
              <Input
                id="probabilidade"
                type="number"
                min={0}
                max={100}
                value={field.value ?? ''}
                onChange={(event) =>
                  field.onChange(event.target.value === '' ? null : Number(event.target.value))
                }
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="dataFechoPrevista" className="text-sm text-text-secondary">
          Data de fecho prevista (opcional)
        </label>
        <Controller
          control={control}
          name="dataFechoPrevista"
          render={({ field }) => (
            <Input
              id="dataFechoPrevista"
              type="date"
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value || null)}
            />
          )}
        />
      </div>
    </form>
  )
}
