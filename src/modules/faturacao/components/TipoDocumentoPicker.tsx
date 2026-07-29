import {
  FileCheck,
  FileMinus,
  FilePlus,
  FileText,
  Receipt,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import type { TipoDocumento, TipoDocumentoEmissao } from '../types'

interface TipoConfig {
  label: string
  icon: LucideIcon
  className: string
}

/** Tipos com cores e ícones distintos (ADR de contexto Angola). */
const TIPOS: Record<TipoDocumento, TipoConfig> = {
  FT: { label: 'Factura (FT)', icon: FileText, className: 'text-info' },
  FR: { label: 'Factura-Recibo (FR)', icon: Receipt, className: 'text-success' },
  NC: { label: 'Nota de Crédito (NC)', icon: FileMinus, className: 'text-danger' },
  ND: { label: 'Nota de Débito (ND)', icon: FilePlus, className: 'text-warning' },
  VD: { label: 'Venda a Dinheiro (VD)', icon: ShoppingCart, className: 'text-brand-accent' },
  RC: { label: 'Recibo (RC)', icon: FileCheck, className: 'text-text-secondary' },
}

/** NC/ND nunca aparecem aqui por omissão — só se emitem via anular, nunca directamente. */
const TIPOS_EMISSIVEIS: TipoDocumentoEmissao[] = ['FT', 'FR', 'VD', 'RC']

interface TipoDocumentoPickerProps {
  value: TipoDocumento
  onChange: (value: TipoDocumento) => void
  id?: string
  disabled?: boolean
  /** Por omissão só os tipos emissíveis directamente (FT/FR/VD/RC). */
  tipos?: TipoDocumento[]
}

export function TipoDocumentoPicker({
  value,
  onChange,
  id,
  disabled,
  tipos = TIPOS_EMISSIVEIS,
}: TipoDocumentoPickerProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as TipoDocumento)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Tipo de documento" />
      </SelectTrigger>
      <SelectContent>
        {tipos.map((tipo) => {
          const config = TIPOS[tipo]
          const Icon = config.icon
          return (
            <SelectItem key={tipo} value={tipo}>
              <span className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', config.className)} aria-hidden="true" />
                {config.label}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
