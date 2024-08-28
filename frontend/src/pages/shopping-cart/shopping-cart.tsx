import ProductSlice from './product-slice'
import Measure from './measure'
import Cart from './cart'
import { Button } from '@/components/ui/button'
import { Trash2, Receipt } from 'lucide-react'
import { ResetCart } from 'wailsjs/go/sales/Sales'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export type ShoppingCartNavValue =
  | '/shopping-cart/product-selection'
  | '/shopping-cart/checkout'

const CartActions = () => {
  const navigate = useNavigate()

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
        }}
      >
        <Receipt size={'2rem'} />
        Ir a caja
      </Button>
    </div>
  )
}

const container = {
  hidden: { opacity: 0.5, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delayChildren: 0.5
    }
  }
}

export default function ShoppingCart() {
  return (
    <motion.div
      className="flex flex-col w-full  gap-4 justify-center items-center max-w-6xl md:p-10"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <ProductSlice />
      <div className="grid  grid-cols-[1.25fr,3fr,0.75fr] gap-6">
        <Measure />
        <Cart />
        <CartActions />
      </div>
    </motion.div>
  )
}
