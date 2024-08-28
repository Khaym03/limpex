import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCleaningProducts } from '@/hooks/produtc'
import { useContext } from 'react'
import { RemoveItemFromCart } from 'wailsjs/go/sales/Sales'
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { SalesCtx } from '@/context/sales-provider'
import { domain } from 'wailsjs/go/models'
import CurrencyDisplay from '@/components/currency-display'
import { motion } from 'framer-motion'

interface IItem {
  item: domain.OrderItemPayload
}

const EmptyCart = () => (
  <div className="absolute text-slate-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
    <ShoppingCartIcon size={'3rem'} />
    <span className="text-lg text-center">Vacio</span>
  </div>
)


const itemAnimation = {
  hidden: { y: 5, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};


const Item = ({ item }: IItem) => {
  const { products } = useCleaningProducts()

  const product = products.find(p => item.product_id === p.id)

  const handler = () => {
    RemoveItemFromCart(item.product_id)
  }

  return (
    <motion.div variants={itemAnimation}>
      <Card
      onClick={handler}
      className={`
      flex flex-col  [&>*]:select-none
      font-medium rounded-lg cursor-pointer transition-transform
    `}
    >
      <CardHeader className="py-2 flex flex-row">
        <CardTitle className="text-base capitalize ">
          {product?.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-xs border-t text-muted-foreground flex py-2 justify-between">
        <span className=" text-muted-foreground">
          <CurrencyDisplay amount={item.subtotal} />
        </span>
        <span>-</span>
        <span className=" text-muted-foreground">{`${item.quantity} Ml`}</span>
      </CardContent>
    </Card>
    </motion.div>
  )
}

const container = {
  hidden: { opacity: 1, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
}

export default function Cart() {
  const { cartItems } = useContext(SalesCtx)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <Card className="grid grid-cols-3 auto-rows-[79px] overflow-y-auto gap-2 bg-zinc-100 p-2 shadow-inner relative rounded-md h-[271px] max-h-[271px]">
        {cartItems.length > 0 ? (
          cartItems.map(item => {
            return <Item key={item.product_id} item={item} />
          })
        ) : (
          <EmptyCart />
        )}
      </Card>
    </motion.div>
  )
}
