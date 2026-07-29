import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useSeries } from '../hooks/useSeries'
import type { TipoDocumento } from '../types'

interface SerieComboboxProps {
  value: string
  onChange: (serieId: string) => void
  id?: string
  disabled?: boolean
  /** Só mostra séries deste tipo de documento — uma NC não pode sair numa série de FT. */
  tipoDocumento?: TipoDocumento
  /** Por omissão só séries activas — não faz sentido emitir numa série desactivada. */
  apenasActivas?: boolean
}

export function SerieCombobox({
  value,
  onChange,
  id,
  disabled,
  tipoDocumento,
  apenasActivas = true,
}: SerieComboboxProps) {
  const { data: series } = useSeries()
  const opcoes = (series ?? []).filter((serie) => {
    if (apenasActivas && !serie.activa) {
      return false
    }
    if (tipoDocumento && serie.tipoDocumento !== tipoDocumento) {
      return false
    }
    return true
  })

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Seleccionar série" />
      </SelectTrigger>
      <SelectContent>
        {opcoes.map((serie) => (
          <SelectItem key={serie.id} value={serie.id}>
            {serie.codigo}/{serie.anoFiscal}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
