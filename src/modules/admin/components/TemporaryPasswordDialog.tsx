import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface TemporaryPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  password: string
}

/**
 * A senha temporária só é devolvida pelo backend uma única vez, nesta
 * resposta — não há forma de a consultar depois. Fica ao critério do
 * admin entregá-la ao utilizador por um canal seguro.
 */
export function TemporaryPasswordDialog({
  open,
  onOpenChange,
  password,
}: TemporaryPasswordDialogProps) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    await navigator.clipboard.writeText(password)
    setCopiado(true)
    toast.success('Senha copiada.')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setCopiado(false)
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Senha temporária gerada</DialogTitle>
          <DialogDescription>
            Entrega esta senha ao utilizador por um canal seguro. Expira em 24 horas e vai ser
            pedida troca obrigatória no primeiro acesso — não é mostrada de novo depois de fechares
            esta janela.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input readOnly value={password} className="font-mono" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copiar}
            aria-label="Copiar senha"
          >
            {copiado ? (
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
