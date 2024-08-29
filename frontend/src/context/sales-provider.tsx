import { createContext, useEffect, useState } from 'react'
import { GetCartItems, GetCustomers, SaveOrder } from 'wailsjs/go/sales/Sales'
import { EventsOff, EventsOn } from 'wailsjs/runtime/runtime'
import { domain } from 'wailsjs/go/models'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'

import { PaymentMethodType } from '@/config/app-config'

type SalesCtxType = {
  selectedProduct: Product | null
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>
  cartItems: domain.OrderItemPayload[]
  setCartItems: React.Dispatch<React.SetStateAction<domain.OrderItemPayload[]>>

  paymentMethod: PaymentMethodType
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodType>>
  save: (costumerId?: number) => Promise<void>

 
}

const defaultValue: SalesCtxType = {
  selectedProduct: null,
  setSelectedProduct: () => {},
  cartItems: [],
  setCartItems: () => {},
  paymentMethod: 'bio-pago',
  setPaymentMethod: () => {},
  save: async () => {},
 
}

export const SalesCtx = createContext<SalesCtxType>(defaultValue)

export default function SalesProvider({ children }: any) {
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null)

  const [cartItems, setCartItems] = useState<domain.OrderItemPayload[]>([])

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('bio-pago')

  const { toast } = useToast()
  const navigate = useNavigate()

  const save = async (costumerId?: number) => {
    if (cartItems.length < 1) return

    const orderPayload: domain.OrderPayload = {
      customer_id: costumerId,
      payment_method: costumerId ? undefined : paymentMethod
    }

    const msg = await SaveOrder(orderPayload)
    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Creado exitosamente'
      })

      setTimeout(dismiss, 3000)

      navigate('/shopping-cart/product-selection')
    
    } else {
      toast({
        title: 'Error',
        description: msg.Error
      })
    }
  }

  useEffect(() => {
    const updateCart = async () => {
      setCartItems((await GetCartItems()) ?? [])
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
        paymentMethod,
        setPaymentMethod,
        save,
       
      }}
    >
      {children}
    </SalesCtx.Provider>
  )
}
