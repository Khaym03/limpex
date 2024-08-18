
import { Outlet, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ShoppingCartRoot() {
  const navige = useNavigate()

  return (
    <div className="h-screen flex flex-col container">
      <Tabs className='py-6' defaultValue="/shopping-cart/product-selection" onValueChange={(route) => navige(route)}>
        <TabsList>
          <TabsTrigger value="/shopping-cart/product-selection">
            Seleccion de productos
          </TabsTrigger>
          <TabsTrigger value="/shopping-cart/checkout">Caja</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex h-full justify-center items-center">
        <Outlet />
      </div>
    </div>
  )
}
