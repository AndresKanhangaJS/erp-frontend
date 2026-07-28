import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { AvisoNIF } from '../components/AvisoNIF'
import { ClienteCombobox } from '../components/ClienteCombobox'
import { LinhasEditor } from '../components/LinhasEditor'
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
    defaultValues: { tipo: 'FT', clienteId: '', moeda: 'AOA', linhas: [] },
  })

  const linhas = useWatch({ control, name: 'linhas' })
  const moeda = useWatch({ control, name: 'moeda' })
  const totais = calcularTotais(linhas ?? [])

  function handleSelectCliente(next: Cliente | null) {
    setCliente(next)
    setValue('clienteId', next?.id ?? '', { shouldValidate: true })
  }

  function onSubmit(values: EmitirFaturaFormValues) {
    emitir.mutate(values, {
      onSuccess: (documento) => navigate(`/faturacao/documentos/${documento.id}`),
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
            name="tipo"
            render={({ field }) => (
              <TipoDocumentoPicker id="tipo" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label htmlFor="cliente" className="text-sm text-text-secondary">
            Cliente
          </label>
          <ClienteCombobox
            id="cliente"
            value={cliente}
            onChange={handleSelectCliente}
            aria-invalid={!!errors.clienteId}
          />
          {errors.clienteId && <p className="text-sm text-danger">{errors.clienteId.message}</p>}
        </div>
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
