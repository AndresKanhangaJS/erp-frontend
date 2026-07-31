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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useDesactivarFuncionario } from '../hooks/useDesactivarFuncionario'
import {
  deactivateFuncionarioSchema,
  type DeactivateFuncionarioFormValues,
} from '../schemas/deactivateFuncionarioSchema'

interface DeactivateFuncionarioDialogProps {
  funcionarioId: string
  nome: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDesactivado: () => void
}

export function DeactivateFuncionarioDialog({
  funcionarioId,
  nome,
  open,
  onOpenChange,
  onDesactivado,
}: DeactivateFuncionarioDialogProps) {
  const desactivar = useDesactivarFuncionario(funcionarioId)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeactivateFuncionarioFormValues>({
    resolver: zodResolver(deactivateFuncionarioSchema),
    defaultValues: { motivo: '', dataCessacao: null },
  })

  function onSubmit(values: DeactivateFuncionarioFormValues) {
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
              O histórico de vencimentos deste funcionário mantém-se intacto — só o estado muda para
              inactivo.
            </DialogDescription>
          </DialogHeader>

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

          <div className="space-y-1">
            <label htmlFor="dataCessacao" className="text-sm text-text-secondary">
              Data de cessação (opcional)
            </label>
            <Controller
              control={control}
              name="dataCessacao"
              render={({ field }) => (
                <Input
                  id="dataCessacao"
                  type="date"
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.value || null)}
                />
              )}
            />
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
