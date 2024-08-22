import { createContext, ReactNode, useState } from 'react'
import { domain } from 'wailsjs/go/models'

type OrderMangerCtxType = {
  selectedOrder: domain.Order | null
  setSelectedOrder: React.Dispatch<React.SetStateAction<domain.Order | null>>
}

const defaultValue: OrderMangerCtxType = {
  selectedOrder: null,
  setSelectedOrder: () => {}
}

export const OrdersManagerCtx = createContext<OrderMangerCtxType>(defaultValue)

interface OrdersMangerProviderProps {
  children: ReactNode
}

export default function OrdersMangerProvider({
  children
}: OrdersMangerProviderProps) {
  const [selectedOrder, setSelectedOrder] = useState<domain.Order | null>(null)

  return (
    <OrdersManagerCtx.Provider
      value={{
        selectedOrder,
        setSelectedOrder
      }}
    >
      {children}
    </OrdersManagerCtx.Provider>
  )
}
