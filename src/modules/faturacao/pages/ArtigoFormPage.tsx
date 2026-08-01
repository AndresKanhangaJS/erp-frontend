import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

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
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { useCriarArtigo } from '../hooks/useCriarArtigo'
import { artigoSchema, type ArtigoFormValues } from '../schemas/artigoSchema'

/** Não há edição de artigos — o backend não expõe rota de update (ver routes.php). */
export default function ArtigoFormPage() {
  const navigate = useNavigate()
  const criar = useCriarArtigo()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ArtigoFormValues>({
    resolver: zodResolver(artigoSchema),
    defaultValues: {
      codigo: '',
      nome: '',
      precoUnitario: 0,
      moeda: 'AOA',
      taxaIva: 0.14,
      unidade: null,
    },
  })

  function onSubmit(values: ArtigoFormValues) {
    criar.mutate(values, {
      onSuccess: () => navigate('/faturacao/artigos'),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title="Novo artigo"
        breadcrumbs={[
          { label: 'Facturação', href: '/faturacao' },
          { label: 'Artigos', href: '/faturacao/artigos' },
          { label: 'Novo' },
        ]}
        actions={
          <PermissionGuard permission="faturacao.criar">
            <Button type="submit" disabled={isSubmitting || criar.isPending}>
              {criar.isPending ? 'A guardar...' : 'Guardar'}
            </Button>
          </PermissionGuard>
        }
      />

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
          <label htmlFor="precoUnitario" className="text-sm text-text-secondary">
            Preço unitário
          </label>
          <Controller
            control={control}
            name="precoUnitario"
            render={({ field }) => (
              <Input
                id="precoUnitario"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={!!errors.precoUnitario}
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
          {errors.precoUnitario && (
            <p className="text-sm text-danger">{errors.precoUnitario.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="moeda" className="text-sm text-text-secondary">
            Moeda
          </label>
          <Controller
            control={control}
            name="moeda"
            render={({ field }) => (
              <Select value={field.value ?? 'AOA'} onValueChange={field.onChange}>
                <SelectTrigger id="moeda" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AOA">AOA</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="taxaIva" className="text-sm text-text-secondary">
            Taxa de IVA
          </label>
          <Controller
            control={control}
            name="taxaIva"
            render={({ field }) => (
              <Select
                value={String(field.value ?? 0.14)}
                onValueChange={(next) => field.onChange(Number(next))}
              >
                <SelectTrigger id="taxaIva" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.14">14%</SelectItem>
                  <SelectItem value="0">0%</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="unidade" className="text-sm text-text-secondary">
            Unidade (opcional)
          </label>
          <Controller
            control={control}
            name="unidade"
            render={({ field }) => (
              <Input
                id="unidade"
                placeholder="Ex.: un, kg, hora"
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </form>
  )
}
