import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import type { Moeda } from '../types'

const LIMITE_NIF_OBRIGATORIO_AOA = 50000

interface AvisoNIFProps {
  total: number
  moeda: Moeda
  clienteTemNif: boolean
}

/**
 * Aviso automático quando o total ≥ 50.000 AOA e o cliente não tem
 * NIF — exigência da AGT. Só se aplica a documentos em AOA: sem uma
 * taxa de câmbio confirmada no momento da emissão (o backend é quem
 * a atribui, ver DocumentoFiscal.taxaCambio), não há como saber o
 * equivalente em AOA de um documento em USD/EUR antes de emitir.
 */
export function AvisoNIF({ total, moeda, clienteTemNif }: AvisoNIFProps) {
  if (clienteTemNif || moeda !== 'AOA' || total < LIMITE_NIF_OBRIGATORIO_AOA) {
    return null
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>NIF do cliente em falta</AlertTitle>
      <AlertDescription>
        A AGT exige o NIF do cliente em documentos com total igual ou superior a 50.000 AOA.
      </AlertDescription>
    </Alert>
  )
}
