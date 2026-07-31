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

import { useLeads } from '../hooks/useLeads'
import type { Lead } from '../types'

interface LeadComboboxProps {
  value: Pick<Lead, 'id' | 'nome'> | null
  onChange: (lead: Lead | null) => void
  id?: string
  disabled?: boolean
}

export function LeadCombobox({ value, onChange, id, disabled }: LeadComboboxProps) {
  const [open, setOpen] = useState(false)
  const { data } = useLeads({ page: 1, perPage: 50 })
  const leads = data?.data ?? []

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
        >
          {value ? value.nome : 'Seleccionar lead'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar lead..." />
          <CommandList>
            <CommandEmpty>Sem leads encontrados.</CommandEmpty>
            <CommandGroup>
              {leads.map((lead) => (
                <CommandItem
                  key={lead.id}
                  value={lead.nome}
                  onSelect={() => {
                    onChange(lead)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('h-4 w-4', value?.id === lead.id ? 'opacity-100' : 'opacity-0')}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span>{lead.nome}</span>
                    {lead.empresa && (
                      <span className="text-xs text-text-muted">{lead.empresa}</span>
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
