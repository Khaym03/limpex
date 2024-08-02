import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCleaningProducts } from '@/hooks/produtc'
import { useEffect, useState } from 'react'
import { EventsOff, EventsOn } from 'wailsjs/runtime'
import { GetCartItems, RemoveItemFromCart } from 'wailsjs/go/sales/Sales'

import { ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { X } from 'lucide-react'

interface IItem {
  item: OrderItemPayload
  handler: () => void
}

const EmptyShoppingCart = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
    <ShoppingCartIcon size={'4rem'} />
    <span className="text-lg text-center">Vacio</span>
  </div>
)

const Item = ({ item, handler }: IItem) => {
  const { products } = useCleaningProducts()

  const product = products.find(p => item.ProductID === p.Id)

  return (
    <Card
      onClick={handler}
      className={`
        flex flex-col  [&>*]:select-none
        font-medium rounded-lg cursor-pointer transition-transform hover:scale-105
      `}
    >
      <CardHeader className="py-3 flex flex-row">
        <CardTitle className="text-black text-base capitalize ">
          {product?.Name}
        </CardTitle>
        <X size={'1.125rem'} className='ml-auto'/>
      </CardHeader>

      <CardContent className="text-sm border-t text-muted-foreground flex py-2 justify-between">
        <span className=" text-muted-foreground">{item.Subtotal} $</span>
        <span>-</span>
        <span className=" text-muted-foreground">{`${item.Quantity} Ml`}</span>
      </CardContent>
    </Card>
  )
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<OrderItemPayload[]>([])
  const { products } = useCleaningProducts()

  const total = cartItems.reduce((a, b) => a + b.Subtotal, 0)

  useEffect(() => {
    GetCartItems().then(items => {
      items ? setCartItems(items) : setCartItems([])
    })
  }, [])

  useEffect(() => {
    const updateCart = async () => {
      const items = await GetCartItems()

      items ? setCartItems(items) : setCartItems([])
    }

    EventsOn('update-cart', updateCart)

    return () => {
      EventsOff('update-cart')
    }
  }, [cartItems])
  return (
    <Card className="grid grid-cols-3 auto-rows-[94px] overflow-y-auto gap-2 bg-zinc-100 p-2 shadow-inner relative h-[316px] rounded-md">
      {cartItems.length > 0 ? (
        cartItems.map((item, i) => {
          return (
            <Item
              key={item.ProductID}
              item={item}
              handler={() => RemoveItemFromCart(item.ProductID)}
            />
          )
        })
      ) : (
        <EmptyShoppingCart />
      )}
    </Card>
  )
}
