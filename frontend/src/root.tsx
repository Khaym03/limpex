import SalesProvider from '@/context/sales-provider'
import { Link, Outlet } from 'react-router-dom'
import {
  ChartLine,
  Settings,
  ShoppingCart as ShoppingCartIcon,
  Newspaper,
  Box
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useContext, useState } from 'react'
import CurrencyProvider from './context/currency-provider'
import CurrencyToggleButton from './components/currency-toggle-button'

const links = [
  {
    name: 'home',
    link: '/shopping-cart/product-selection',
    Icon: ShoppingCartIcon
  },
  {
    name: 'metrics',
    link: '/metrics',
    Icon: ChartLine
  },
  {
    name: 'today-info',
    link: '/today-info',
    Icon: Newspaper
  },
  {
    name: 'products',
    link: '/products',
    Icon: Box
  },
  {
    name: 'ajustes',
    link: '/settings',
    Icon: Settings
  }
]

export default function Root() {
  const [selectedLink, setSelectedLink] = useState('/')

  return (
    <CurrencyProvider>
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-4 h-full">
            <TooltipProvider>
              {links.map(l => (
                <Tooltip key={l.link}>
                  <TooltipTrigger asChild>
                    <Link
                      to={l.link}
                      onClick={() => setSelectedLink(l.link)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors  md:h-8 md:w-8
                    ${
                      selectedLink === l.link
                        ? 'bg-gray-100 text-primary'
                        : 'hover:text-foreground'
                    }
                      `}
                    >
                      <l.Icon className="h-5 w-5" />
                      <span className="sr-only">Dashboard</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{l.name}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
            <CurrencyToggleButton />
          </nav>
        </aside>
        <main className="h-screen ml-14 font-medium relative">
       
          <SalesProvider>
            <Outlet />
          </SalesProvider>
       
        </main>
      </div>
    </CurrencyProvider>
  )
}
