import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useRegistarPagamento } from '../hooks/useRegistarPagamento'
import { pagamentoSchema, type PagamentoFormValues } from '../schemas/pagamentoSchema'

interface RegistarPagamentoDialogProps {
  faturaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const METODOS: { value: PagamentoFormValues['metodo']; label: string }[] = [
  { value: 'transferencia', label: 'Transferência' },
  { value: 'numerario', label: 'Numerário' },
  { value: 'outro', label: 'Outro' },
]

export function RegistarPagamentoDialog({
  faturaId,
  open,
  onOpenChange,
}: RegistarPagamentoDialogProps) {
  const registar = useRegistarPagamento(faturaId)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PagamentoFormValues>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: { valor: 0, metodo: 'transferencia', referencia: '', dataPagamento: null },
  })

  function onSubmit(values: PagamentoFormValues) {
    registar.mutate(values, {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>Registar pagamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-1">
            <label htmlFor="valor" className="text-sm text-text-secondary">
              Valor
            </label>
            <Controller
              control={control}
              name="valor"
              render={({ field }) => (
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.valor}
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              )}
            />
            {errors.valor && <p className="text-sm text-danger">{errors.valor.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="metodo" className="text-sm text-text-secondary">
              Método
            </label>
            <Controller
              control={control}
              name="metodo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="metodo" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METODOS.map((metodo) => (
                      <SelectItem key={metodo.value} value={metodo.value}>
                        {metodo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="referencia" className="text-sm text-text-secondary">
              Referência (opcional)
            </label>
            <Controller
              control={control}
              name="referencia"
              render={({ field }) => (
                <Input id="referencia" value={field.value ?? ''} onChange={field.onChange} />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || registar.isPending}>
              {registar.isPending ? 'A registar...' : 'Registar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
