import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import {} from '@radix-ui/react-dialog'
import { useToast } from '@/components/ui/use-toast'
import { UserRoundPlus } from 'lucide-react'
import { CreateCustomer } from 'wailsjs/go/sales/Sales'
import { domain } from 'wailsjs/go/models'

export function CreateCostumerDialog() {
  const [costumerName, setCostumerName] = useState('')
  const [CI, setCI] = useState('')
  const [disable, setDisable] = useState(true)
  const { toast } = useToast()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    if (id === 'costumer-ci') {
      setCI(value)
    }
    if (id === 'costumer-name') {
      setCostumerName(value)
    }
  }

  const resetForm = () => {
    setCostumerName('')
    setCI('')
    setDisable(true)
  }

  const handleCreation = async (e: MouseEvent<HTMLButtonElement>) => {
    const msg = (await CreateCustomer({
      name: costumerName,
      ci: CI
    }))

    if (msg.success) {
      const { dismiss } = toast({
        title: 'Creado exitosamente'
      })

      setTimeout(dismiss, 3000)
    } else {
      toast({
        title: 'Error',
        description: msg.error
      })
    }

    resetForm()
  }

  useEffect(() => {
    setDisable(!costumerName)
  }, [costumerName])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} className="w-12">
          <UserRoundPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-semibold">
        <DialogHeader>
          <DialogTitle>Cliente</DialogTitle>
          <DialogDescription>
            Llena los campos para crear un Cliente. Click crear cuando este
            listo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costumer-name" className="text-right">
              Nombre
            </Label>
            <Input
              id="costumer-name"
              onChange={handleInputChange}
              value={costumerName}
              className="col-span-3"
              placeholder="que sea unico..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="costumer-ci" className="text-right">
              CI (opcional)
            </Label>
            <Input
              id="costumer-ci"
              onChange={handleInputChange}
              placeholder="ejem: 30.776.557"
              className="col-span-3 appearance-none"
              value={CI}
              type="text"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={disable} onClick={handleCreation} type="submit">
              Crear
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
