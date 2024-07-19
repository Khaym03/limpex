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
import { CreateCleaningProduct } from 'wailsjs/go/main/App'
import { useToast } from '@/components/ui/use-toast'
import { describe } from 'node:test'

export function CreateProductDialog() {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [disable, setDisable] = useState(true)
  const { toast } = useToast()

  const shouldDisable = () => {
    setDisable(productName === '' || productPrice === 0)
  }

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value)
    shouldDisable()
  }

  const onChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setProductPrice(
      Number.isNaN(+e.target.value) ? productPrice : +e.target.value
    )
    shouldDisable()
  }

  const handleCreation = async (e: MouseEvent<HTMLButtonElement>) => {
    const msg = (await CreateCleaningProduct(
      productName,
      productPrice,
      'text-slate-700'
    )) as Message

    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Creado exitosamente'
      })

      setTimeout(dismiss, 3000)
    } else {
      toast({
        title: 'Error',
        description: msg.Error
      })
    }

    // Reset states
    setProductName('')
    setProductPrice(0)
    setDisable(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Crear Producto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear producto de limpieza</DialogTitle>
          <DialogDescription>
            Llena los campos para crear un producto de limpieza. Click crear
            cuando este listo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              onChange={onChangeName}
              value={productName}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="price" className="text-right">
              Precio
            </Label>
            <Input
              id="price"
              onChange={onChangePrice}
              placeholder="00.00"
              className="col-span-3 appearance-none"
              type="number"
            />
            <div className="pointer-events-none flex items-center absolute right-4">
              <span className="text-slate-400 text-sm">$</span>
            </div>
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
