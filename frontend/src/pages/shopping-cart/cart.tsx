import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCleaningProducts } from '@/hooks/produtc'
import { useContext, useEffect, useState } from 'react'
import { EventsOff, EventsOn } from 'wailsjs/runtime'
import { GetCartItems, RemoveItemFromCart } from 'wailsjs/go/sales/Sales'
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { X } from 'lucide-react'
import { animated, useSpring } from '@react-spring/web'
import { SalesCtx } from '@/context/sales-provider'

interface IItem {
  item: OrderItemPayload
}

const EmptyCart = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
    <ShoppingCartIcon size={'4rem'} />
    <span className="text-lg text-center">Vacio</span>
  </div>
)

const Item = ({ item }: IItem) => {
  const { products } = useCleaningProducts()

  const product = products.find(p => item.ProductID === p.Id)

  const handler = () => {
    RemoveItemFromCart(item.ProductID)
  }

  const animation = useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 }
  })

  return (
    <animated.div style={{ ...animation }}>
      <Card
        onClick={handler}
        className={`
      flex flex-col  [&>*]:select-none
      font-medium rounded-lg cursor-pointer transition-transform
    `}
      >
        <CardHeader className="py-3 flex flex-row">
          <CardTitle className="text-black text-base capitalize ">
            {product?.Name}
          </CardTitle>
          <X size={'1.125rem'} className="ml-auto" />
        </CardHeader>

        <CardContent className="text-sm border-t text-muted-foreground flex py-2 justify-between">
          <span className=" text-muted-foreground">{item.Subtotal} $</span>
          <span>-</span>
          <span className=" text-muted-foreground">{`${item.Quantity} Ml`}</span>
        </CardContent>
      </Card>
    </animated.div>
  )
}

export default function Cart() {
  const { cartItems } = useContext(SalesCtx)

  return (
    <Card className="grid grid-cols-3 auto-rows-[94px] overflow-y-auto gap-2 bg-zinc-100 p-2 shadow-inner relative h-[316px] rounded-md">
      {cartItems.length > 0 ? (
        cartItems.map(item => {
          return <Item key={item.ProductID} item={item} />
        })
      ) : (
        <EmptyCart />
      )}
    </Card>
  )
}
