import { useState } from 'react'
import { pt } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { formatDate } from '@/shared/utils/formatDate'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  id?: string
  disabled?: boolean
  placeholder?: string
  className?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

/** Sempre dd/MM/yyyy na apresentação (formatDate), nunca o formato do browser. */
export function DatePicker({
  value,
  onChange,
  id,
  disabled,
  placeholder = 'Seleccionar data',
  className,
  ...aria
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn('w-full justify-start font-normal', !value && 'text-text-muted', className)}
          {...aria}
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange(date ?? null)
            setOpen(false)
          }}
          locale={pt}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
