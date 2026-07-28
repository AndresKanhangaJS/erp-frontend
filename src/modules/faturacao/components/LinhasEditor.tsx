import { Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useWatch, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import { ArtigoCombobox } from './ArtigoCombobox'
import type { EmitirFaturaFormValues } from '../schemas/emitirFaturaSchema'
import type { Artigo } from '../types'

interface LinhasEditorProps {
  control: Control<EmitirFaturaFormValues>
}

interface LinhaRowProps {
  control: Control<EmitirFaturaFormValues>
  index: number
  onRemove: () => void
}

/**
 * Linha isolada num componente próprio: o array "fields" do
 * useFieldArray só reflecte operações estruturais (adicionar/remover),
 * não actualiza a cada tecla — para o subtotal reagir em tempo real
 * à quantidade/preço, tem de ler o valor ao vivo via useWatch.
 */
function LinhaRow({ control, index, onRemove }: LinhaRowProps) {
  const linha = useWatch({ control, name: `linhas.${index}` })
  const subtotalLinha = linha.quantidade * linha.precoUnitario

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span>{linha.designacao}</span>
          {linha.taxaIva === 0 && (
            <Controller
              control={control}
              name={`linhas.${index}.motivoIsencao`}
              render={({ field }) => (
                <Input
                  placeholder="Motivo de isenção de IVA"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  className="h-7 text-xs"
                  aria-label="Motivo de isenção de IVA"
                />
              )}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`linhas.${index}.quantidade`}
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step="1"
              value={field.value}
              onChange={(event) => field.onChange(Number(event.target.value))}
              className="text-right font-mono"
              aria-label="Quantidade"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`linhas.${index}.precoUnitario`}
          render={({ field }) => (
            <Input
              type="number"
              min={0}
              step="0.01"
              value={field.value}
              onChange={(event) => field.onChange(Number(event.target.value))}
              className="text-right font-mono"
              aria-label="Preço unitário"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`linhas.${index}.taxaIva`}
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(next) => field.onChange(Number(next))}
            >
              <SelectTrigger aria-label="Taxa de IVA" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14">14%</SelectItem>
                <SelectItem value="0">0%</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </TableCell>
      <TableCell>
        <CurrencyDisplay value={subtotalLinha} className="block text-right" />
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

export function LinhasEditor({ control }: LinhasEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'linhas' })

  function handleAdicionarArtigo(artigo: Artigo) {
    append({
      artigoId: artigo.id,
      designacao: artigo.designacao,
      quantidade: 1,
      precoUnitario: artigo.precoUnitario,
      taxaIva: artigo.taxaIva,
      motivoIsencao: null,
    })
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artigo</TableHead>
              <TableHead className="w-24 text-right">Qtd.</TableHead>
              <TableHead className="w-36 text-right">Preço unitário</TableHead>
              <TableHead className="w-24">IVA</TableHead>
              <TableHead className="w-36 text-right">Subtotal</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center text-sm text-text-muted">
                  Sem linhas — adiciona um artigo abaixo.
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

      <ArtigoCombobox onSelect={handleAdicionarArtigo} />
    </div>
  )
}
