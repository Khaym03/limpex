import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CurrencyCtx } from '@/context/currency-provider'
import { CreateProductDialog } from '@/dialogs/create-cleaning-product'
import { DeleteProductDialog } from '@/dialogs/delete-cleaning-product'
import { UpdateProductDialog } from '@/dialogs/update-cleaning-product'
import { fadeInAnimationVariants } from '@/lib/animations'
import { motion } from 'framer-motion'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dollar, Update } from 'wailsjs/go/currency/currency'
import { DeleteCustomerComponent } from './delete-customer'
import SettingsProvider, { useSettings } from '@/context/settings-provider'

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
  const [newPrice, setNewPrice] = useState(0)
  const [isUpdated, setIsUpdated] = useState(false)

  const { dollar, setDollar } = useContext(CurrencyCtx)

  useEffect(() => {
    const fetchDollarValue = async () => {
      const dollarValue = await Dollar()
      setDollar(dollarValue)
    }

    fetchDollarValue()
  }, [isUpdated])

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setNewPrice(Number(value))
  }

  return (
    <SettingsProvider>
      <section className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <Header />

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Nav />
          <motion.main
            variants={fadeInAnimationVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Dollar</CardTitle>
                <CardDescription>
                  Actualizalo segun veas si la tasa de cambio aumenta.
                </CardDescription>
                <span className="mt-4 text-muted-foreground/80">
                  Valor registrado ${dollar}
                </span>
              </CardHeader>
              <CardFooter className="border-t flex gap-2 px-6 py-4">
                <Input
                  className="max-w-[300px]"
                  placeholder="Ingresa un valor ejem: 36.64"
                  value={newPrice === 0 ? '' : newPrice}
                  onChange={handleOnchange}
                  type="number"
                />
                <Button
                  onClick={() => {
                    Update(newPrice)
                    setIsUpdated(v => !v)
                  }}
                >
                  Actualizar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Borrar cliente</CardTitle>
                <CardDescription>
                  Al seleccionar un cliente tiene la opcion de borrarlo.
                </CardDescription>

                <CardFooter className="border-t flex gap-2 p-0 pt-4">
                  <DeleteCustomerSection />
                </CardFooter>
              </CardHeader>
            </Card>
          </motion.main>
        </div>
      </section>
    </SettingsProvider>
  )
}

function DeleteCustomerSection() {
  const { customerId, deleteCustomer } = useSettings()

  return (
    <>
      <DeleteCustomerComponent />
      <Button onClick={() => deleteCustomer()} variant={'destructive'} disabled={customerId === 0}>
        Borrar
      </Button>
    </>
  )
}
