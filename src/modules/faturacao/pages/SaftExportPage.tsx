import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useExportarSaft } from '../hooks/useExportarSaft'
import { saftSchema, type SaftFormValues } from '../schemas/saftSchema'

/** Exportação assíncrona (Job) — não há ficheiro para descarregar de imediato, só a confirmação de que foi despachada. */
export default function SaftExportPage() {
  const exportar = useExportarSaft()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SaftFormValues>({
    resolver: zodResolver(saftSchema),
    defaultValues: { anoFiscal: new Date().getFullYear(), mes: null },
  })

  function onSubmit(values: SaftFormValues) {
    exportar.mutate(values, {
      onSuccess: (resultado) => toast.success(resultado.message),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md space-y-6">
      <PageHeader title="Exportar SAF-T" />

      <div className="space-y-1">
        <label htmlFor="anoFiscal" className="text-sm text-text-secondary">
          Ano fiscal
        </label>
        <Controller
          control={control}
          name="anoFiscal"
          render={({ field }) => (
            <Input
              id="anoFiscal"
              type="number"
              aria-invalid={!!errors.anoFiscal}
              value={field.value}
              onChange={(event) => field.onChange(Number(event.target.value))}
            />
          )}
        />
        {errors.anoFiscal && <p className="text-sm text-danger">{errors.anoFiscal.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="mes" className="text-sm text-text-secondary">
          Mês (opcional — vazio exporta o ano inteiro)
        </label>
        <Controller
          control={control}
          name="mes"
          render={({ field }) => (
            <Input
              id="mes"
              type="number"
              min={1}
              max={12}
              value={field.value ?? ''}
              onChange={(event) =>
                field.onChange(event.target.value === '' ? null : Number(event.target.value))
              }
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || exportar.isPending}>
        {exportar.isPending ? 'A exportar...' : 'Exportar'}
      </Button>
    </form>
  )
}
