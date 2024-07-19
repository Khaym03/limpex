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
import { CreateCleaningProduct, DeleteProductById } from 'wailsjs/go/main/App'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent
} from '@/components/ui/select'
import { useCleaningProducts } from '@/hooks/produtc'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { ProductSelect } from '@/components/product-select'

export function DeleteProductDialog() {
  const { products } = useCleaningProducts()
  const [prodId, setProdId] = useState(0)
  const { toast } = useToast()

  const clickHandler = async () => {
    if (!prodId || !products.length) {
      console.error('Producto no seleccionado o lista de productos vacía.')
      return
    }
    const selectedProd = products.find(p => p.Id === prodId)

    const msg = (await DeleteProductById(prodId)) as Message

    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Borrado',
        description: `Se a borrado ${selectedProd?.Name} correctamente.`
      })

      setTimeout(() => dismiss(), 2000)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Borra Producto</Button>
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
