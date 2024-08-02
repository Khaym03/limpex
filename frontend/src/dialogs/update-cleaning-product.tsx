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
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [productColor, setProductColor] = useState('')

  const [disable, setDisable] = useState(true)
  const { toast } = useToast()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    if (id === 'price') {
      const priceValue = parseFloat(value)
      setProductPrice(isNaN(priceValue) || priceValue < 0 ? 0 : priceValue)
    } else {
      switch (id) {
        case 'name':
          setProductName(value)
          break
        case 'color':
          setProductColor(value)
          break
        default:
          break
      }
    }
  }

  const resetForm = () => {
    setProductName('')
    setProductPrice(0)
    setProductColor('')
    setProductId(0)
  }

  const handleUpdate = async () => {
    if (!productId) return

    const msg = (await UpdateCleaningProduct(
      productId,
      productName,
      productPrice,
      productColor
    )) as Message

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
      const selectedProd = products.find(p => p.Id === productId)
      if (selectedProd) {
        setProductName(selectedProd.Name)
        setProductPrice(selectedProd.Price)
        setProductColor(selectedProd.CleaningProductData.Color)
      }
    }
  }, [productId])

  useEffect(() => {
    setDisable(!productName || !productPrice || !productColor)
  }, [productName, productPrice, productColor])

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
              onChange={handleInputChange}
              placeholder="00.00"
              className="col-span-3 appearance-none"
              type="number"
              value={productPrice}
            />
            <div className="pointer-events-none flex items-center absolute right-4">
              <span className="text-slate-400 text-sm">$</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Input
              id="color"
              onChange={handleInputChange}
              value={productColor}
              className="col-span-3"
            />
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
