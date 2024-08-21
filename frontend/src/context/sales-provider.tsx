import { createContext, useEffect, useState } from 'react'
import { GetCartItems, GetCostumers, SaveOrder } from 'wailsjs/go/sales/Sales'
import { EventsOff, EventsOn } from 'wailsjs/runtime/runtime'
import { domain } from 'wailsjs/go/models'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartNavValue } from '@/pages/shopping-cart/shopping-cart'
import { PaymentMethodType } from '@/config/app-config'

type SalesCtxType = {
  selectedProduct: Product | null
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>
  cartItems: domain.OrderItemPayload[]
  setCartItems: React.Dispatch<React.SetStateAction<domain.OrderItemPayload[]>>

  paymentMethod: PaymentMethodType
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodType>>
  save: (costumerId?: number) => Promise<void>

  tabNavValue: ShoppingCartNavValue
  setTabNavValue: React.Dispatch<React.SetStateAction<ShoppingCartNavValue>>
}

const defaultValue: SalesCtxType = {
  selectedProduct: null,
  setSelectedProduct: () => {},
  cartItems: [],
  setCartItems: () => {},
  paymentMethod: 'bio-pago',
  setPaymentMethod: () => {},
  save: async () => {},
  tabNavValue: '/shopping-cart/product-selection',
  setTabNavValue: () => {}
}

export const SalesCtx = createContext<SalesCtxType>(defaultValue)

export default function SalesProvider({ children }: any) {
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null)

  const [cartItems, setCartItems] = useState<domain.OrderItemPayload[]>([])

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bio-pago')
  const [tabNavValue, setTabNavValue] = useState<ShoppingCartNavValue>(
    '/shopping-cart/product-selection'
  )

  useEffect(() => {
    GetCartItems().then(items => {
      items ? setCartItems(items) : setCartItems([])
    })
  }, [])

  const { toast } = useToast()
  const navigate = useNavigate()

  const save = async (costumerId?: number) => {
    if (cartItems.length < 1) return

    const orderPayload: domain.OrderPayload = {
      costumer_id: costumerId,
      payment_method: costumerId ? undefined : paymentMethod
    }

    const msg = await SaveOrder(orderPayload)
    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Creado exitosamente'
      })

      setTimeout(dismiss, 3000)

      navigate('/shopping-cart/product-selection')
      setTabNavValue('/shopping-cart/product-selection')
    } else {
      toast({
        title: 'Error',
        description: msg.Error
      })
    }
  }

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
        paymentMethod,
        setPaymentMethod,
        save,
        tabNavValue,
        setTabNavValue
      }}
    >
      {children}
    </SalesCtx.Provider>
  )
}
