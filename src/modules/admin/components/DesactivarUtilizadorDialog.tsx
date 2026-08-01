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

import { useDesactivarUtilizador } from '../hooks/useDesactivarUtilizador'
import {
  desactivarUtilizadorSchema,
  type DesactivarUtilizadorFormValues,
} from '../schemas/desactivarUtilizadorSchema'

interface DesactivarUtilizadorDialogProps {
  utilizadorId: string
  nome: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDesactivado: () => void
}

export function DesactivarUtilizadorDialog({
  utilizadorId,
  nome,
  open,
  onOpenChange,
  onDesactivado,
}: DesactivarUtilizadorDialogProps) {
  const desactivar = useDesactivarUtilizador(utilizadorId)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DesactivarUtilizadorFormValues>({
    resolver: zodResolver(desactivarUtilizadorSchema),
    defaultValues: { reason: '' },
  })

  function onSubmit(values: DesactivarUtilizadorFormValues) {
    desactivar.mutate(values, {
      onSuccess: () => {
        reset()
        onDesactivado()
      },
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>Desactivar {nome}</DialogTitle>
            <DialogDescription>
              O utilizador perde o acesso imediatamente e todas as sessões activas dele são
              revogadas. Esta acção não pode ser revertida.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1">
            <label htmlFor="reason" className="text-sm text-text-secondary">
              Motivo
            </label>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <Textarea id="reason" aria-invalid={!!errors.reason} {...field} />
              )}
            />
            {errors.reason && <p className="text-sm text-danger">{errors.reason.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || desactivar.isPending}
            >
              {desactivar.isPending ? 'A desactivar...' : 'Desactivar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
