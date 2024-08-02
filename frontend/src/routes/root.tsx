import { Button } from '@/components/ui/button'
import SalesProvider from '@/context/sales-provider'
import { CreateProductDialog } from '@/dialogs/create-cleaning-product'
import { RiHome4Line } from 'react-icons/ri'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { RiSettings3Fill } from 'react-icons/ri'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useState } from 'react'

const links = [
  {
    name: 'home',
    link: '/selection',
    Icon: Home
  },
  {
    name: 'configuracion',
    link: '/config',
    Icon: Settings
  }
]

export default function Root() {
  const [selectedLink, setSelectedLink] = useState('/')

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
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
        </nav>
      </aside>

    
        {/* <header className="px-3 py-2 font-semibold border-b flex gap-8">
          <span>{document.location.href}</span>
        </header> */}
        <main className="h-screen ml-14 font-semibold relative">
          <SalesProvider>
            <Outlet />
          </SalesProvider>
        </main>
    
    </div>
  )
}
