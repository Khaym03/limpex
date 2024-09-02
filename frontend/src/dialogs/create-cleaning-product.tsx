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
import { useCurrency } from '@/context/currency-provider'

interface CreateProductDialogProps {
  callback?: () => void
}

export function CreateProductDialog({ callback }: CreateProductDialogProps) {
  const [name, setName] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [disable, setDisable] = useState(true)
  const { toast } = useToast()
  const { currency, dollar } = useCurrency()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    if (id === 'purchase-price') {
      const priceValue = parseFloat(value)
      setPurchasePrice(isNaN(priceValue) || priceValue < 0 ? 0 : priceValue)
    }

    if (id === 'sale-price') {
      const priceValue = parseFloat(value)
      setSalePrice(isNaN(priceValue) || priceValue < 0 ? 0 : priceValue)
    }

    if (id === 'name') {
      setName(value)
    }
  }

  const resetForm = () => {
    setName('')
    setPurchasePrice(0)
    setSalePrice(0)
    setDisable(true)
  }

  const handleCreation = async (e: MouseEvent<HTMLButtonElement>) => {
    const pp: ProductPaylaod = {
      name: name,
      purchase_price:
        currency === 'VES' ? purchasePrice / dollar : purchasePrice,
      sale_price: currency === 'VES' ? salePrice / dollar : salePrice
    }

    const msg = (await CreateCleaningProduct(pp)) as Message

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

    resetForm()
    if (callback) {
      callback()
    }
  }

  useEffect(() => {
    setDisable(!name || !purchasePrice || !salePrice)
  }, [name, purchasePrice, salePrice])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-min">
          Crear Producto
        </Button>
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
              onChange={handleInputChange}
              value={name}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="purchase-price" className="text-right">
              Precio de compra
            </Label>
            <Input
              id="purchase-price"
              onChange={handleInputChange}
              placeholder="00.00"
              className="col-span-3 appearance-none"
              type="number"
            />
            <div className="pointer-events-none flex items-center absolute right-4">
              <span className="text-slate-400 text-sm">$</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="sale-price" className="text-right">
              Precio de venta
            </Label>
            <Input
              id="sale-price"
              onChange={handleInputChange}
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
