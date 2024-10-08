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
import { useState } from 'react'
import { DeleteProductById } from 'wailsjs/go/main/App'
import { useCleaningProducts } from '@/hooks/produtc'
import { useToast } from '@/components/ui/use-toast'
import { ProductSelect } from '@/components/product-select'
import { useProducts } from '@/context/products-provider'
import { domain } from 'wailsjs/go/models'

interface DeleteProductDialogProps {
  callback?: () => void
}

export function DeleteProductDialog({ callback }: DeleteProductDialogProps) {
  const [prodId, setProdId] = useState(0)
  const { toast } = useToast()
  const { products } = useProducts()

  const clickHandler = async () => {
    if (!prodId || !products.length) {
      console.error('Producto no seleccionado o lista de productos vacía.')
      return
    }
    const selectedProd = products.find(p => p.id === prodId)

    const msg = (await DeleteProductById(prodId))

    if (msg.success) {
      const { dismiss } = toast({
        title: 'Borrado',
        description: `Se a borrado ${selectedProd?.name} correctamente.`
      })

      setProdId(0)
      setTimeout(() => dismiss(), 2000)
      if (callback) callback()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-min">
          Borra Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borra permanentemente un producto</DialogTitle>
          <DialogDescription>
            Selecciona el producto que deseas borrar.
          </DialogDescription>
        </DialogHeader>

        <ProductSelect products={products} onSelect={setProdId} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'destructive'} onClick={clickHandler}>
              Borrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
