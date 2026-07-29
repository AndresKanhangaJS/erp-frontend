import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useContas } from '../hooks/useContas'
import type { Conta } from '../types'

type ContaSelecionada = Pick<Conta, 'id' | 'codigo' | 'designacao'>

interface ContaComboboxProps {
  value: ContaSelecionada | null
  onChange: (conta: Conta | null) => void
  id?: string
  disabled?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export function ContaCombobox({ value, onChange, id, disabled, ...aria }: ContaComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useContas(search)
  const contas = data?.data ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', !value && 'text-text-muted')}
          {...aria}
        >
          <span className="truncate">
            {value ? (
              <>
                <span className="font-mono">{value.codigo}</span> — {value.designacao}
              </>
            ) : (
              'Seleccionar conta'
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Pesquisar conta..." value={search} onValueChange={setSearch} />
          <CommandList>
            {isLoading && <CommandEmpty>A pesquisar...</CommandEmpty>}
            {!isLoading && contas.length === 0 && (
              <CommandEmpty>Sem contas encontradas.</CommandEmpty>
            )}
            <CommandGroup>
              {contas.map((conta) => (
                <CommandItem
                  key={conta.id}
                  value={conta.id}
                  disabled={!conta.permiteLancamentos}
                  onSelect={() => {
                    onChange(conta)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('h-4 w-4', value?.id === conta.id ? 'opacity-100' : 'opacity-0')}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-text-muted">{conta.codigo}</span>
                  <span>{conta.designacao}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
