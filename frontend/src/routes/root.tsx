import { Button } from '@/components/ui/button'
import { CreateProductDialog } from "@/dialogs/create-cleaning-product"
import { RiHome4Line } from 'react-icons/ri'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const links = [
  {
    name: 'home',
    link: '/selection',
    Icon: RiHome4Line
  }
]

export default function Root() {
  const navigate = useNavigate()

  return (
    <div className="h-screen grid grid-cols-5">
      <nav className="px-3 py-2 border-r">
        <ul className="flex gap-2 flex-col">
          {links.map(l => (
            <Button
              className="flex justify-start"
              variant={'ghost'}
              onClick={() => navigate(l.link)}
            >
              <l.Icon size={'1.25rem'} />
              <span className="ml-2">{l.name}</span>
            </Button>
          ))}
        </ul>
      </nav>
      <section className="col-span-4 flex flex-col ">
        <header className="px-3 py-2 font-semibold border-b flex gap-8">
          <span>{document.location.href}</span>
          <CreateProductDialog/>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </section>
    </div>
  )
}
