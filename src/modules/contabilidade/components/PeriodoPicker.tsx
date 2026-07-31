import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { usePeriodos } from '../hooks/usePeriodos'

interface PeriodoPickerProps {
  value: string
  onChange: (periodoId: string) => void
  id?: string
  disabled?: boolean
  /** Só mostrar períodos abertos — não faz sentido lançar num período fechado. */
  apenasAbertos?: boolean
}

export function PeriodoPicker({
  value,
  onChange,
  id,
  disabled,
  apenasAbertos = true,
}: PeriodoPickerProps) {
  const { data: periodos } = usePeriodos()
  const opcoes = apenasAbertos ? (periodos ?? []).filter((p) => !p.fechado) : (periodos ?? [])

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Seleccionar período" />
      </SelectTrigger>
      <SelectContent>
        {opcoes.map((periodo) => (
          <SelectItem key={periodo.id} value={periodo.id}>
            {String(periodo.mes).padStart(2, '0')}/{periodo.anoFiscal}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
