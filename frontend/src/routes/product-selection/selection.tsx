import ProductSlice from './product-slice'
import Measure from './measure'
import ShoppingCart from './shopping-cart'
import { Button } from '@/components/ui/button'
import { Trash2, Receipt } from 'lucide-react'
import { ResetCart } from 'wailsjs/go/sales/Sales'

const CartActions = () => {
  return (
    <div className="grid grid-row-2 gap-2 grow text-lg">
      <Button
        className="h-full flex flex-col gap-2 text-base"
        variant={'destructive'}
        onClick={ResetCart}
      >
        <Trash2 size={'2rem'} />
        Limpiar
      </Button>
      <Button className="h-full flex flex-col gap-2 text-base">
        <Receipt size={'2rem'} />
        Ir a caja
      </Button>
    </div>
  )
}

export default function Selection() {
  return (
    <div className="flex flex-col h-screen p-6 gap-4 justify-center items-center">
      <ProductSlice />
      <div className="grid grid-cols-[1.25fr,3fr,0.75fr] gap-6 w-11/12 mx-auto">
        <Measure /> <ShoppingCart /> <CartActions />
      </div>
    </div>
  )
}
