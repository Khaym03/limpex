import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { CreateProductDialog } from '@/dialogs/create-cleaning-product'
import { DeleteProductDialog } from '@/dialogs/delete-cleaning-product'
import { UpdateProductDialog } from '@/dialogs/update-cleaning-product'
import { useFadeIn } from '@/lib/animations'
import { useSpring, animated } from '@react-spring/web'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
    </header>
  )
}

const Nav = () => {
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      <Link to="#" className="font-semibold text-primary">
        General
      </Link>
      <Link to="#">Security</Link>
      <Link to="#">Integrations</Link>
      <Link to="#">Support</Link>
      <Link to="#">Organizations</Link>
      <Link to="#">Advanced</Link>
    </nav>
  )
}

export default function Settings() {
  const fadeIn = useFadeIn()

  return (
    <animated.section style={{...fadeIn}} className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Header />

      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <Nav />
        <main>
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription>
                Todo lo referente a la entidad producto.
              </CardDescription>
            </CardHeader>
            <CardFooter className="border-t px-6 py-4 flex gap-2">
              <CreateProductDialog />
              <DeleteProductDialog />
              <UpdateProductDialog />
            </CardFooter>
          </Card>
        </main>
      </div>
    </animated.section>
  )
}
