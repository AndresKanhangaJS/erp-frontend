import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { applyApiErrorsToForm } from '@/shared/utils/mapApiErrors'

import { ArmazemPicker } from '../components/ArmazemPicker'
import { ArtigoStockCombobox } from '../components/ArtigoStockCombobox'
import { useCriarInventario } from '../hooks/useCriarInventario'
import { inventarioSchema, type InventarioFormValues } from '../schemas/inventarioSchema'

export default function InventarioFormPage() {
  const navigate = useNavigate()
  const criar = useCriarInventario()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InventarioFormValues>({
    resolver: zodResolver(inventarioSchema),
    defaultValues: { armazemId: '', observacoes: null, linhas: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'linhas' })

  function onSubmit(values: InventarioFormValues) {
    criar.mutate(values, {
      onSuccess: (inventario) => navigate(`/stock/inventarios/${inventario.id}`),
      onError: (error) => applyApiErrorsToForm(error, setError),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6" noValidate>
      <PageHeader
        title="Novo inventário"
        breadcrumbs={[
          { label: 'Stock', href: '/stock' },
          { label: 'Inventários', href: '/stock/inventarios' },
          { label: 'Novo' },
        ]}
        actions={
          <Button type="submit" disabled={isSubmitting || criar.isPending}>
            {criar.isPending ? 'A criar...' : 'Criar inventário'}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="armazemId" className="text-sm text-text-secondary">
            Armazém
          </label>
          <Controller
            control={control}
            name="armazemId"
            render={({ field }) => (
              <ArmazemPicker id="armazemId" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.armazemId && <p className="text-sm text-danger">{errors.armazemId.message}</p>}
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
      </div>

      <Card className="overflow-x-auto py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artigo</TableHead>
              <TableHead className="w-40 text-right">Quantidade contada</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-6 text-center text-sm text-text-muted">
                  Sem artigos — adiciona pelo menos um.
                </TableCell>
              </TableRow>
            )}
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Controller
                    control={control}
                    name={`linhas.${index}`}
                    render={({ field: linhaField }) => (
                      <ArtigoStockCombobox
                        value={
                          linhaField.value.artigoId
                            ? {
                                id: linhaField.value.artigoId,
                                codigo: linhaField.value.artigoCodigo,
                                nome: linhaField.value.artigoNome,
                              }
                            : null
                        }
                        onChange={(artigo) =>
                          linhaField.onChange({
                            ...linhaField.value,
                            artigoId: artigo?.id ?? '',
                            artigoCodigo: artigo?.codigo ?? '',
                            artigoNome: artigo?.nome ?? '',
                          })
                        }
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={control}
                    name={`linhas.${index}.quantidadeContada`}
                    render={({ field: qtdField }) => (
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={qtdField.value}
                        onChange={(event) => qtdField.onChange(Number(event.target.value))}
                        className="text-right font-mono"
                        aria-label="Quantidade contada"
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    aria-label="Remover linha"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {errors.linhas?.message && <p className="text-sm text-danger">{errors.linhas.message}</p>}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ artigoId: '', artigoCodigo: '', artigoNome: '', quantidadeContada: 0 })
        }
      >
        Adicionar artigo
      </Button>
    </form>
  )
}
