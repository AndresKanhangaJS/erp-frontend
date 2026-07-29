import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { SerieCombobox } from './SerieCombobox'
import { useAnularFatura } from '../hooks/useAnularFatura'
import { anularFaturaSchema, type AnularFaturaFormValues } from '../schemas/anularFaturaSchema'

interface AnularFaturaDialogProps {
  faturaId: string
  numero: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAnulada: (notaCreditoId: string) => void
}

/**
 * Anular gera sempre uma Nota de Crédito real (nunca apaga nem esconde
 * a factura original — ADR-008), por isso precisa de série de NC e
 * motivo — não é um simples "sim/não" de confirmação.
 */
export function AnularFaturaDialog({
  faturaId,
  numero,
  open,
  onOpenChange,
  onAnulada,
}: AnularFaturaDialogProps) {
  const anular = useAnularFatura()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnularFaturaFormValues>({
    resolver: zodResolver(anularFaturaSchema),
    defaultValues: { serieNcId: '', motivo: '' },
  })

  function onSubmit(values: AnularFaturaFormValues) {
    anular.mutate(
      { id: faturaId, values },
      {
        onSuccess: (notaCredito) => {
          reset()
          onOpenChange(false)
          onAnulada(notaCredito.id)
        },
        onError: (error) => applyApiErrorsToForm(error, setError),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>Anular {numero}</DialogTitle>
            <DialogDescription>
              Gera uma Nota de Crédito para reverter esta factura. A factura original não é apagada
              — fica marcada como anulada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1">
            <label htmlFor="serieNcId" className="text-sm text-text-secondary">
              Série da Nota de Crédito
            </label>
            <Controller
              control={control}
              name="serieNcId"
              render={({ field }) => (
                <SerieCombobox
                  id="serieNcId"
                  value={field.value}
                  onChange={field.onChange}
                  tipoDocumento="NC"
                />
              )}
            />
            {errors.serieNcId && <p className="text-sm text-danger">{errors.serieNcId.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="motivo" className="text-sm text-text-secondary">
              Motivo
            </label>
            <Controller
              control={control}
              name="motivo"
              render={({ field }) => (
                <Textarea id="motivo" aria-invalid={!!errors.motivo} {...field} />
              )}
            />
            {errors.motivo && <p className="text-sm text-danger">{errors.motivo.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={isSubmitting || anular.isPending}>
              {anular.isPending ? 'A anular...' : 'Anular'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
