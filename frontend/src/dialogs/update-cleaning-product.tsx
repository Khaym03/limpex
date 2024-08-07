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
import { ChangeEvent, useEffect, useState } from 'react'
import { UpdateCleaningProduct } from 'wailsjs/go/main/App'
import { useToast } from '@/components/ui/use-toast'
import { ProductSelect } from '@/components/product-select'
import { useCleaningProducts } from '@/hooks/produtc'

export function UpdateProductDialog() {
  const { products } = useCleaningProducts()
  const [productId, setProductId] = useState(0)
  const [name, setName] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)

  // const [color, setColor] = useState('')

  const [disable, setDisable] = useState(true)
  const { toast } = useToast()

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
    setProductId(0)
  }

  const handleUpdate = async () => {
    if (!productId) return

    const p: Product = {
      id: productId,
      name: name,
      purchase_price: purchasePrice,
      sale_price: salePrice
    }

    const msg = (await UpdateCleaningProduct(p)) as Message

    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Actualizado exitosamente'
      })

      setTimeout(dismiss, 3000)
    } else {
      toast({
        title: 'Error',
        description: msg.Error
      })
    }

    resetForm()
  }

  useEffect(() => {
    if (productId) {
      const selectedProd = products.find(p => p.id === productId)
      if (selectedProd) {
        setName(selectedProd.name)
        setPurchasePrice(selectedProd.purchase_price)
        setSalePrice(selectedProd.sale_price)
      }
    }
  }, [productId])

  useEffect(() => {
    setDisable(!name || !purchasePrice || !salePrice)
  }, [name, purchasePrice, salePrice])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Editar Producto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar producto de limpieza</DialogTitle>
          <DialogDescription>
            Llena los campos para editar un producto de limpieza. Click editar
            cuando este listo.
          </DialogDescription>
        </DialogHeader>
        <ProductSelect products={products} onSelect={setProductId} />
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
              value={purchasePrice}
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
              value={salePrice}
            />
            <div className="pointer-events-none flex items-center absolute right-4">
              <span className="text-slate-400 text-sm">$</span>
            </div>
          </div>
         
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={disable} onClick={handleUpdate} type="submit">
              Editar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
