import { useEffect, useState } from 'react'

import { getFaturaQrCodeBlob } from '@/api/modules/faturacao'

/**
 * O endpoint do QR code devolve um PNG binário atrás de autenticação
 * (Authorization + X-Tenant-ID) — um <img src> simples não consegue
 * enviar esses cabeçalhos, por isso o blob é pedido via axios e
 * transformado num object URL local. Revogar o URL no cleanup evita
 * fugas de memória (cada blob URL fica vivo até ser revogado à mão).
 */
export function useFaturaQrCode(id: string | undefined) {
  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let objectUrl: string | null = null
    let cancelado = false

    setIsLoading(true)
    setIsError(false)

    getFaturaQrCodeBlob(id)
      .then((blob) => {
        if (cancelado) {
          return
        }
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        if (!cancelado) {
          setIsError(true)
        }
      })
      .finally(() => {
        if (!cancelado) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelado = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [id])

  return { url, isLoading, isError }
}
