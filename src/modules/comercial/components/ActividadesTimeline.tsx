import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'
import { formatDateTime } from '@/shared/utils/formatDate'

import { useActividades } from '../hooks/useActividades'
import { useRegistarActividade } from '../hooks/useRegistarActividade'
import { actividadeSchema, type ActividadeFormValues } from '../schemas/actividadeSchema'
import type { RelacionadoTipo } from '../types'

const TIPO_LABELS: Record<ActividadeFormValues['tipo'], string> = {
  chamada: 'Chamada',
  email: 'Email',
  reuniao: 'Reunião',
  nota: 'Nota',
}

interface ActividadesTimelineProps {
  relacionadoTipo: RelacionadoTipo
  relacionadoId: string
}

export function ActividadesTimeline({ relacionadoTipo, relacionadoId }: ActividadesTimelineProps) {
  const { data: actividades, isLoading } = useActividades(relacionadoTipo, relacionadoId)
  const registar = useRegistarActividade()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActividadeFormValues>({
    resolver: zodResolver(actividadeSchema),
    defaultValues: { tipo: 'nota', descricao: '', data: null, relacionadoTipo, relacionadoId },
  })

  function onSubmit(values: ActividadeFormValues) {
    registar.mutate(values, {
      onSuccess: () =>
        reset({ tipo: 'nota', descricao: '', data: null, relacionadoTipo, relacionadoId }),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-text-primary">Actividades</h2>

      <PermissionGuard permission="comercial.gerir_clientes">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
          <div className="flex gap-2">
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-36">
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
            <div className="flex-1">
              <Controller
                control={control}
                name="descricao"
                render={({ field }) => (
                  <Textarea
                    placeholder="Descreve a actividade..."
                    className="min-h-9"
                    aria-invalid={!!errors.descricao}
                    {...field}
                  />
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting || registar.isPending}>
              {registar.isPending ? 'A registar...' : 'Registar'}
            </Button>
          </div>
          {errors.descricao && <p className="text-sm text-danger">{errors.descricao.message}</p>}
        </form>
      </PermissionGuard>

      <div className="space-y-2">
        {isLoading && <p className="text-sm text-text-muted">A carregar...</p>}
        {!isLoading && (actividades ?? []).length === 0 && (
          <p className="text-sm text-text-muted">Sem actividades registadas.</p>
        )}
        {(actividades ?? []).map((actividade) => (
          <div key={actividade.id} className="rounded-lg border border-border bg-surface-card p-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{TIPO_LABELS[actividade.tipo]}</span>
              <span>{formatDateTime(actividade.data)}</span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{actividade.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
