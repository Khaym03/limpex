import ProductSlice from './product-slice'
import Measure from './measure'
import Cart from './cart'
import { Button } from '@/components/ui/button'
import { Trash2, Receipt } from 'lucide-react'
import { ResetCart } from 'wailsjs/go/sales/Sales'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { SalesCtx } from '@/context/sales-provider'

export type ShoppingCartNavValue =
  | '/shopping-cart/product-selection'
  | '/shopping-cart/checkout'

const CartActions = () => {
  const navigate = useNavigate()
  const { setTabNavValue } = useContext(SalesCtx)

  return (
    <div className="grid grid-row-2 gap-4 grow text-lg h-full">
      <Button
        className="h-full flex flex-col gap-2 text-base"
        variant={'destructive'}
        onClick={ResetCart}
      >
        <Trash2 size={'2rem'} />
        Limpiar
      </Button>
      <Button
        className="h-full flex flex-col gap-2 text-base"
        onClick={() => {
          navigate('/shopping-cart/checkout')
          setTabNavValue('/shopping-cart/checkout')
        }}
      >
        <Receipt size={'2rem'} />
        Ir a caja
      </Button>
    </div>
  )
}

export default function ShoppingCart() {
  return (
    <div className="flex flex-col  gap-4 justify-center items-center">
      <ProductSlice />
      <div className="grid grid-cols-[1.25fr,3fr,0.75fr] gap-6 w-11/12 mx-auto">
        <Measure />
        <Cart />
        <CartActions />
      </div>
    </div>
  )
}
