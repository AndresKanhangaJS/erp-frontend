import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'

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
import { CurrencyDisplay } from '@/shared/components/ui/CurrencyDisplay'

import { useArtigos } from '../hooks/useArtigos'
import type { Artigo } from '../types'

interface ArtigoComboboxProps {
  onSelect: (artigo: Artigo) => void
  disabled?: boolean
}

/** Não guarda selecção — cada escolha adiciona uma nova linha (ver LinhasEditor). */
export function ArtigoCombobox({ onSelect, disabled }: ArtigoComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useArtigos(search)
  const artigos = data?.data ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-between font-normal text-text-muted"
        >
          Adicionar artigo
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pesquisar artigo..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <CommandEmpty>A pesquisar...</CommandEmpty>}
            {!isLoading && artigos.length === 0 && (
              <CommandEmpty>Sem artigos encontrados.</CommandEmpty>
            )}
            <CommandGroup>
              {artigos.map((artigo) => (
                <CommandItem
                  key={artigo.id}
                  value={artigo.id}
                  onSelect={() => {
                    onSelect(artigo)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span>{artigo.nome}</span>
                    <CurrencyDisplay value={artigo.precoUnitario} className="text-xs" />
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
