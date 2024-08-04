import { createContext, useEffect, useState } from 'react'
import { GetCartItems, GetCostumers } from 'wailsjs/go/sales/Sales'
import { EventsOff, EventsOn } from 'wailsjs/runtime/runtime'

type SalesCtxType = {
  selectedProduct: CleaningProduct | null
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<CleaningProduct | null>
  >
  cartItems: OrderItemPayload[]
  setCartItems: React.Dispatch<React.SetStateAction<OrderItemPayload[]>>

  // costumers: Costumer[]
  // setCostumers: React.Dispatch<React.SetStateAction<Costumer[]>>
}

const defaultContextValue: SalesCtxType = {
  selectedProduct: null,
  setSelectedProduct: () => {},
  cartItems: [],
  setCartItems: () => {},
  // costumers: [],
  // setCostumers: () => {}
}

export const SalesCtx = createContext(defaultContextValue)

export default function SalesProvider({ children }: any) {
  const [selectedProduct, setSelectedProduct] =
    useState<null | CleaningProduct>(null)

  const [cartItems, setCartItems] = useState<OrderItemPayload[]>([])
  

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
    <SalesCtx.Provider
      value={{
        selectedProduct,
        setSelectedProduct,
        cartItems,
        setCartItems,
        // costumers,
        // setCostumers
      }}
    >
      {children}
    </SalesCtx.Provider>
  )
}
