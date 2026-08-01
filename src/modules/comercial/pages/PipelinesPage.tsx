import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useCriarPipeline } from '../hooks/useCriarPipeline'
import { usePipelines } from '../hooks/usePipelines'
import { pipelineSchema, type PipelineFormValues } from '../schemas/pipelineSchema'

const TIPO_LABELS: Record<string, string> = {
  aberto: 'Aberto',
  ganho: 'Ganho',
  perdido: 'Perdido',
}

export default function PipelinesPage() {
  const { data: pipelines, isLoading } = usePipelines()
  const criar = useCriarPipeline()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      nome: '',
      estagios: [
        { nome: 'Aberto', tipo: 'aberto' },
        { nome: 'Ganho', tipo: 'ganho' },
        { nome: 'Perdido', tipo: 'perdido' },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'estagios' })

  function onSubmit(values: PipelineFormValues) {
    criar.mutate(values, {
      onSuccess: () =>
        reset({
          nome: '',
          estagios: [
            { nome: 'Aberto', tipo: 'aberto' },
            { nome: 'Ganho', tipo: 'ganho' },
            { nome: 'Perdido', tipo: 'perdido' },
          ],
        }),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pipelines" />

      <PermissionGuard permission="comercial.gerir_pipeline">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="max-w-xl space-y-4 rounded-xl bg-surface-card p-4 ring-1 ring-foreground/10"
        >
          <div className="space-y-1">
            <label htmlFor="nome" className="text-sm text-text-secondary">
              Nome do pipeline
            </label>
            <Controller
              control={control}
              name="nome"
              render={({ field }) => <Input id="nome" aria-invalid={!!errors.nome} {...field} />}
            />
            {errors.nome && <p className="text-sm text-danger">{errors.nome.message}</p>}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-text-secondary">Estágios</p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Controller
                  control={control}
                  name={`estagios.${index}.nome`}
                  render={({ field: nomeField }) => (
                    <Input placeholder="Nome do estágio" className="flex-1" {...nomeField} />
                  )}
                />
                <Controller
                  control={control}
                  name={`estagios.${index}.tipo`}
                  render={({ field: tipoField }) => (
                    <Select value={tipoField.value} onValueChange={tipoField.onChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TIPO_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  aria-label="Remover estágio"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
            {errors.estagios?.message && (
              <p className="text-sm text-danger">{errors.estagios.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ nome: '', tipo: 'aberto' })}
            >
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Adicionar estágio
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting || criar.isPending}>
            {criar.isPending ? 'A criar...' : 'Criar pipeline'}
          </Button>
        </form>
      </PermissionGuard>

      <div className="space-y-4">
        {isLoading && <p className="text-sm text-text-muted">A carregar...</p>}
        {(pipelines ?? []).map((pipeline) => (
          <Card key={pipeline.id}>
            <CardContent>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text-primary">{pipeline.nome}</h3>
                {pipeline.isPadrao && <Badge>Padrão</Badge>}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {pipeline.estagios.map((estagio) => (
                  <Badge key={estagio.id} className="bg-surface-raised text-text-secondary">
                    {estagio.nome} ({TIPO_LABELS[estagio.tipo]})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
