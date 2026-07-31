import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useArmazens } from '../hooks/useArmazens'

interface ArmazemPickerProps {
  value: string
  onChange: (armazemId: string) => void
  id?: string
  disabled?: boolean
}

export function ArmazemPicker({ value, onChange, id, disabled }: ArmazemPickerProps) {
  const { data: armazens } = useArmazens()

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Seleccionar armazém" />
      </SelectTrigger>
      <SelectContent>
        {(armazens ?? []).map((armazem) => (
          <SelectItem key={armazem.id} value={armazem.id}>
            {armazem.codigo} — {armazem.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
