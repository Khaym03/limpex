import { Outlet } from 'react-router-dom'
import SalesProvider from '@/context/sales-provider'
import { ThemeProvider } from '@/components/theme-provider'

export default function ShoppingCartRoot() {
  return (
   
      <SalesProvider>
        <section className="h-screen flex flex-col container justify-center items-center">
          <Outlet />
        </section>
      </SalesProvider>
 
  )
}
