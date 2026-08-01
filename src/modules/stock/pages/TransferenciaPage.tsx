import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { PermissionGuard } from '@/shared/components/ui/PermissionGuard'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { ArmazemPicker } from '../components/ArmazemPicker'
import { ArtigoStockCombobox, type ArtigoSelecionado } from '../components/ArtigoStockCombobox'
import { useTransferirStock } from '../hooks/useTransferirStock'
import { transferenciaSchema, type TransferenciaFormValues } from '../schemas/transferenciaSchema'

export default function TransferenciaPage() {
  const navigate = useNavigate()
  const transferir = useTransferirStock()
  const [artigo, setArtigo] = useState<ArtigoSelecionado | null>(null)

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TransferenciaFormValues>({
    resolver: zodResolver(transferenciaSchema),
    defaultValues: {
      armazemOrigemId: '',
      armazemDestinoId: '',
      artigoId: '',
      quantidade: 0,
      observacoes: null,
    },
  })

  function onSubmit(values: TransferenciaFormValues) {
    transferir.mutate(values, {
      onSuccess: () => navigate('/stock/movimentos'),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6" noValidate>
      <PageHeader
        title="Transferir entre armazéns"
        breadcrumbs={[
          { label: 'Stock', href: '/stock' },
          { label: 'Movimentos', href: '/stock/movimentos' },
          { label: 'Transferir' },
        ]}
        actions={
          <PermissionGuard permission="stock.movimentar">
            <Button type="submit" disabled={isSubmitting || transferir.isPending}>
              {transferir.isPending ? 'A transferir...' : 'Transferir'}
            </Button>
          </PermissionGuard>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="armazemOrigemId" className="text-sm text-text-secondary">
            Armazém de origem
          </label>
          <Controller
            control={control}
            name="armazemOrigemId"
            render={({ field }) => (
              <ArmazemPicker id="armazemOrigemId" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.armazemOrigemId && (
            <p className="text-sm text-danger">{errors.armazemOrigemId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="armazemDestinoId" className="text-sm text-text-secondary">
            Armazém de destino
          </label>
          <Controller
            control={control}
            name="armazemDestinoId"
            render={({ field }) => (
              <ArmazemPicker id="armazemDestinoId" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.armazemDestinoId && (
            <p className="text-sm text-danger">{errors.armazemDestinoId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="artigoId" className="text-sm text-text-secondary">
          Artigo
        </label>
        <Controller
          control={control}
          name="artigoId"
          render={() => (
            <ArtigoStockCombobox
              id="artigoId"
              value={artigo}
              onChange={(next) => {
                setArtigo(next)
                setValue('artigoId', next?.id ?? '', { shouldValidate: true })
              }}
            />
          )}
        />
        {errors.artigoId && <p className="text-sm text-danger">{errors.artigoId.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="quantidade" className="text-sm text-text-secondary">
          Quantidade
        </label>
        <Controller
          control={control}
          name="quantidade"
          render={({ field }) => (
            <Input
              id="quantidade"
              type="number"
              min={0}
              step="0.01"
              aria-invalid={!!errors.quantidade}
              value={field.value}
              onChange={(event) => field.onChange(Number(event.target.value))}
            />
          )}
        />
        {errors.quantidade && <p className="text-sm text-danger">{errors.quantidade.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="observacoes" className="text-sm text-text-secondary">
          Observações (opcional)
        </label>
        <Controller
          control={control}
          name="observacoes"
          render={({ field }) => (
            <Input
              id="observacoes"
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value || null)}
            />
          )}
        />
      </div>
    </form>
  )
}
