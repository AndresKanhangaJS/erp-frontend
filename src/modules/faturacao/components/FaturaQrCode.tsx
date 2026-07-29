import { Skeleton } from '@/components/ui/skeleton'

import { useFaturaQrCode } from '../hooks/useFaturaQrCode'

interface FaturaQrCodeProps {
  faturaId: string
}

/**
 * O QR code é gerado e assinado pelo backend (QRCodeService) — isto só
 * o busca (via blob autenticado, ver useFaturaQrCode) e mostra.
 */
export function FaturaQrCode({ faturaId }: FaturaQrCodeProps) {
  const { url, isLoading, isError } = useFaturaQrCode(faturaId)

  if (isLoading) {
    return <Skeleton className="h-28 w-28 rounded-lg" />
  }

  if (isError || !url) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface-card p-3">
      <img src={url} alt="QR code do documento" width={112} height={112} />
    </div>
  )
}
