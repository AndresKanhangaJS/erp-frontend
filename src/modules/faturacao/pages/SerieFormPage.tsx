import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { TipoDocumentoPicker } from '../components/TipoDocumentoPicker'
import { useCriarSerie } from '../hooks/useCriarSerie'
import { serieSchema, type SerieFormValues } from '../schemas/serieSchema'

const TODOS_OS_TIPOS: SerieFormValues['tipoDocumento'][] = ['FT', 'FR', 'NC', 'ND', 'VD', 'RC']

/** Não há edição de séries — o backend não expõe rota de update (ver routes.php). */
export default function SerieFormPage() {
  const navigate = useNavigate()
  const criar = useCriarSerie()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SerieFormValues>({
    resolver: zodResolver(serieSchema),
    defaultValues: { tipoDocumento: 'FT', codigo: '', anoFiscal: new Date().getFullYear() },
  })

  function onSubmit(values: SerieFormValues) {
    criar.mutate(values, {
      onSuccess: () => navigate('/faturacao/series'),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title="Nova série"
        breadcrumbs={[
          { label: 'Facturação', href: '/faturacao' },
          { label: 'Séries', href: '/faturacao/series' },
          { label: 'Nova' },
        ]}
        actions={
          <Button type="submit" disabled={isSubmitting || criar.isPending}>
            {criar.isPending ? 'A guardar...' : 'Guardar'}
          </Button>
        }
      />

      <div className="space-y-1">
        <label htmlFor="tipoDocumento" className="text-sm text-text-secondary">
          Tipo de documento
        </label>
        <Controller
          control={control}
          name="tipoDocumento"
          render={({ field }) => (
            <TipoDocumentoPicker
              id="tipoDocumento"
              value={field.value}
              onChange={field.onChange}
              tipos={TODOS_OS_TIPOS}
            />
          )}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="codigo" className="text-sm text-text-secondary">
          Código
        </label>
        <Controller
          control={control}
          name="codigo"
          render={({ field }) => <Input id="codigo" aria-invalid={!!errors.codigo} {...field} />}
        />
        {errors.codigo && <p className="text-sm text-danger">{errors.codigo.message}</p>}
      </div>

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
    </form>
  )
}
