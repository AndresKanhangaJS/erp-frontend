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

import { useClientes } from '../hooks/useClientes'
import type { Cliente } from '../types'

interface ClienteComboboxProps {
  value: Cliente | null
  onChange: (cliente: Cliente | null) => void
  id?: string
  disabled?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export function ClienteCombobox({ value, onChange, id, disabled, ...aria }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useClientes(search)
  const clientes = data?.data ?? []

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
          {value ? value.nome : 'Seleccionar cliente'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pesquisar cliente..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <CommandEmpty>A pesquisar...</CommandEmpty>}
            {!isLoading && clientes.length === 0 && (
              <CommandEmpty>Sem clientes encontrados.</CommandEmpty>
            )}
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.id}
                  onSelect={() => {
                    onChange(cliente)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value?.id === cliente.id ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span>{cliente.nome}</span>
                    {cliente.nif && (
                      <span className="font-mono text-xs text-text-muted">{cliente.nif}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
