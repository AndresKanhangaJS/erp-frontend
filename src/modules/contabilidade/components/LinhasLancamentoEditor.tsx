import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ContaCombobox } from './ContaCombobox'
import type { LancamentoFormValues } from '../schemas/lancamentoSchema'

interface LinhasLancamentoEditorProps {
  control: Control<LancamentoFormValues>
}

interface LinhaRowProps {
  control: Control<LancamentoFormValues>
  index: number
  onRemove: () => void
}

function LinhaRow({ control, index, onRemove }: LinhaRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Controller
          control={control}
          name={`linhas.${index}`}
          render={({ field }) => (
            <ContaCombobox
              value={
                field.value.contaId
                  ? {
                      id: field.value.contaId,
                      codigo: field.value.contaCodigo,
                      designacao: field.value.contaDesignacao,
                    }
                  : null
              }
              onChange={(conta) =>
                field.onChange({
                  ...field.value,
                  contaId: conta?.id ?? '',
                  contaCodigo: conta?.codigo ?? '',
                  contaDesignacao: conta?.designacao ?? '',
                })
              }
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`linhas.${index}.debito`}
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step="0.01"
              value={field.value || ''}
              onChange={(event) => field.onChange(Number(event.target.value) || 0)}
              className="text-right font-mono"
              aria-label="Débito"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`linhas.${index}.credito`}
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step="0.01"
              value={field.value || ''}
              onChange={(event) => field.onChange(Number(event.target.value) || 0)}
              className="text-right font-mono"
              aria-label="Crédito"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Remover linha"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function LinhasLancamentoEditor({ control }: LinhasLancamentoEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'linhas' })

  function handleAdicionarLinha() {
    append({ contaId: '', contaCodigo: '', contaDesignacao: '', debito: 0, credito: 0 })
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conta</TableHead>
              <TableHead className="w-36 text-right">Débito</TableHead>
              <TableHead className="w-36 text-right">Crédito</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-sm text-text-muted">
                  Sem linhas — adiciona pelo menos duas (partidas dobradas).
                </TableCell>
              </TableRow>
            )}
            {fields.map((field, index) => (
              <LinhaRow
                key={field.id}
                control={control}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Button type="button" variant="outline" onClick={handleAdicionarLinha}>
        <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
        Adicionar linha
      </Button>
    </div>
  )
}
