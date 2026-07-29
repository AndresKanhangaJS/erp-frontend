import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
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
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { AvisoNIF } from '../components/AvisoNIF'
import { ClienteCombobox } from '../components/ClienteCombobox'
import { LinhasEditor } from '../components/LinhasEditor'
import { SerieCombobox } from '../components/SerieCombobox'
import { TipoDocumentoPicker } from '../components/TipoDocumentoPicker'
import { TotaisPanel } from '../components/TotaisPanel'
import { useEmitirFatura } from '../hooks/useEmitirFatura'
import { emitirFaturaSchema, type EmitirFaturaFormValues } from '../schemas/emitirFaturaSchema'
import type { Cliente } from '../types'
import { calcularTotais } from '../utils'

export default function EmitirFaturaPage() {
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const emitir = useEmitirFatura()

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmitirFaturaFormValues>({
    resolver: zodResolver(emitirFaturaSchema),
    defaultValues: {
      serieId: '',
      tipoDocumento: 'FT',
      clienteId: null,
      moeda: 'AOA',
      taxaCambio: null,
      linhas: [],
    },
  })

  const linhas = useWatch({ control, name: 'linhas' })
  const moeda = useWatch({ control, name: 'moeda' }) ?? 'AOA'
  const tipoDocumento = useWatch({ control, name: 'tipoDocumento' })
  const totais = calcularTotais(linhas ?? [])

  function handleSelectCliente(next: Cliente | null) {
    setCliente(next)
    setValue('clienteId', next?.id ?? null, { shouldValidate: true })
  }

  function onSubmit(values: EmitirFaturaFormValues) {
    emitir.mutate(values, {
      onSuccess: (fatura) => navigate(`/faturacao/faturas/${fatura.id}`),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <PageHeader
        title="Emitir factura"
        breadcrumbs={[{ label: 'Facturação', href: '/faturacao' }, { label: 'Emitir' }]}
        actions={
          <Button type="submit" disabled={isSubmitting || emitir.isPending}>
            {emitir.isPending ? 'A emitir...' : 'Emitir'}
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="tipo" className="text-sm text-text-secondary">
            Tipo de documento
          </label>
          <Controller
            control={control}
            name="tipoDocumento"
            render={({ field }) => (
              <TipoDocumentoPicker id="tipo" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="serie" className="text-sm text-text-secondary">
            Série
          </label>
          <Controller
            control={control}
            name="serieId"
            render={({ field }) => (
              <SerieCombobox
                id="serie"
                value={field.value}
                onChange={field.onChange}
                tipoDocumento={tipoDocumento}
              />
            )}
          />
          {errors.serieId && <p className="text-sm text-danger">{errors.serieId.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="cliente" className="text-sm text-text-secondary">
            Cliente (opcional)
          </label>
          <ClienteCombobox id="cliente" value={cliente} onChange={handleSelectCliente} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
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

        {moeda !== 'AOA' && (
          <div className="space-y-1">
            <label htmlFor="taxaCambio" className="text-sm text-text-secondary">
              Taxa de câmbio (opcional)
            </label>
            <Controller
              control={control}
              name="taxaCambio"
              render={({ field }) => (
                <Input
                  id="taxaCambio"
                  type="number"
                  min={0}
                  step="0.0001"
                  placeholder="Calculada automaticamente se vazio"
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(event.target.value === '' ? null : Number(event.target.value))
                  }
                />
              )}
            />
          </div>
        )}
      </div>

      <AvisoNIF total={totais.total} moeda={moeda} clienteTemNif={Boolean(cliente?.nif)} />

      <LinhasEditor control={control} />
      {errors.linhas?.message && <p className="text-sm text-danger">{errors.linhas.message}</p>}

      <TotaisPanel
        subtotal={totais.subtotal}
        totalIva={totais.totalIva}
        total={totais.total}
        moeda={moeda}
      />
    </form>
  )
}
