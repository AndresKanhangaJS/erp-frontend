import { QRCodeSVG } from 'qrcode.react'

interface DocumentoQrCodeProps {
  data: string
  codigoVerificacao: string | null
}

/**
 * QR code + código de verificação exigidos pela facturação electrónica
 * da AGT — o payload em si é gerado e assinado pelo backend, isto só
 * o renderiza.
 */
export function DocumentoQrCode({ data, codigoVerificacao }: DocumentoQrCodeProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface-card p-3">
      <QRCodeSVG value={data} size={112} level="M" />
      {codigoVerificacao && (
        <p className="font-mono text-xs text-text-muted" aria-label="Código de verificação AGT">
          {codigoVerificacao}
        </p>
      )}
    </div>
  )
}
