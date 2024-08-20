import { Outlet, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContext } from 'react'
import { SalesCtx } from '@/context/sales-provider'

export default function ShoppingCartRoot() {
  const navige = useNavigate()
  const { tabNavValue, setTabNavValue } = useContext(SalesCtx)

  return (
    <div className="h-screen flex flex-col container">
      <Tabs
        className="py-6"
        value={tabNavValue}
        onValueChange={route => navige(route)}
      >
        <TabsList>
          <TabsTrigger
            onClick={() => setTabNavValue('/shopping-cart/product-selection')}
            value="/shopping-cart/product-selection"
          >
            Seleccion de productos
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setTabNavValue('/shopping-cart/checkout')}
            value="/shopping-cart/checkout"
          >
            Caja
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex h-full justify-center items-center">
        <Outlet />
      </div>
    </div>
  )
}
