import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'

import { listArtigos } from '@/api/modules/faturacao'
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
import { useDebounce } from '@/shared/hooks/useDebounce'

export interface ArtigoSelecionado {
  id: string
  codigo: string
  nome: string
}

interface ArtigoStockComboboxProps {
  value: ArtigoSelecionado | null
  onChange: (artigo: ArtigoSelecionado | null) => void
  id?: string
  disabled?: boolean
}

/**
 * O catálogo de artigos vive na Facturação (Stock não tem CRUD próprio
 * de artigos — ArtigoControlavelSpec só valida que o artigo referenciado
 * existe lá, ver app/Modules/Stock/Specs). Reutiliza o mesmo endpoint em
 * vez de duplicar dados.
 */
export function ArtigoStockCombobox({ value, onChange, id, disabled }: ArtigoStockComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { data, isLoading } = useQuery({
    queryKey: ['faturacao', 'artigos', { search: debouncedSearch }],
    queryFn: () => listArtigos({ search: debouncedSearch, perPage: 10 }),
    staleTime: 60_000,
  })
  const artigos = data?.data ?? []

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
          <span className="truncate">
            {value ? (
              <>
                <span className="font-mono">{value.codigo}</span> — {value.nome}
              </>
            ) : (
              'Seleccionar artigo'
            )}
          </span>
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
                    onChange({ id: artigo.id, codigo: artigo.codigo, nome: artigo.nome })
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('h-4 w-4', value?.id === artigo.id ? 'opacity-100' : 'opacity-0')}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-text-muted">{artigo.codigo}</span>
                  <span>{artigo.nome}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
