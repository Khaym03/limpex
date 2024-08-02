import { createContext, useState } from 'react'

type SalesCtxType = {
  selectedProduct: CleaningProduct | null
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<CleaningProduct | null>
  >
  orderItems: OrderItemPayload[]
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItemPayload[]>>
}

const defaultContextValue: SalesCtxType = {
  selectedProduct: null,
  setSelectedProduct: () => {},
  orderItems: [],
  setOrderItems: () => {}
}

export const SalesCtx = createContext(defaultContextValue)

export default function SalesProvider({ children }: any) {
  const [selectedProduct, setSelectedProduct] =
    useState<null | CleaningProduct>(null)
  const [orderItems, setOrderItems] = useState<OrderItemPayload[]>([])

  return (
    <SalesCtx.Provider
      value={{ selectedProduct, setSelectedProduct, orderItems, setOrderItems }}
    >
      {children}
    </SalesCtx.Provider>
  )
}
