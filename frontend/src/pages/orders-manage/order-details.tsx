import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Clock,
  CreditCardIcon,
  MoreVertical,
  MousePointerClick
} from 'lucide-react'
import { domain, time } from 'wailsjs/go/models'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useCleaningProducts } from '@/hooks/produtc'
import { useCustomerDetails } from '@/hooks/costumer'
import { cn, formatTheHoursToClientTimeZone } from '@/lib/utils'
import { PAYMENT_METHODS, PaymentMethodType } from '@/config/app-config'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { DeleteOrder } from 'wailsjs/go/sales/Sales'
import { useToast } from '@/components/ui/use-toast'
import { PayWholeOrder } from '@/dialogs/pay-whole-order'
import { useContext, useMemo } from 'react'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'
import CurrencyDisplay from '@/components/currency-display'
import { motion } from 'framer-motion'
import { fadeInAnimationVariants } from '@/lib/animations'

export default function OrderDetails() {
  const { selectedOrder, setSelectedOrder, setOrders, orders } =
    useContext(OrdersManagerCtx)

  const { products } = useCleaningProducts()
  const prodName = (item: domain.OrderItem) =>
    products?.find(p => p.id === item.product_id)?.name || '???'

  const { costumer } = useCustomerDetails(selectedOrder?.customer_id)
  const { toast } = useToast()

  const deleteOrder = async () => {
    if (!selectedOrder) return

    const msg = await DeleteOrder(selectedOrder.id)

    if (msg.success) {
      const { dismiss } = toast({
        title: 'Borrado',
        description: `Se a borrado la Order #${selectedOrder.id} correctamente.`
      })

      // Trigger a visual update
      setSelectedOrder(null)
      setOrders([])
      setTimeout(() => dismiss(), 2000)
    } else {
      const { dismiss } = toast({
        title: 'Error',
        description: msg.error
      })
    }
  }

  return selectedOrder ? (
    <motion.div
      variants={fadeInAnimationVariants}
      initial="initial"
      animate="animate"
    >
      <Card className="flex flex-col overflow-hidden min-w-[296px] h-full">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order {`#${selectedOrder?.id}`}
            </CardTitle>
            <CardDescription>
              Fecha: {format(selectedOrder.created_at as string, 'PPP', { locale: es })}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={deleteOrder}>
                  Borrar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 grow text-sm overflow-y-auto">
          <div className="grid gap-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="order-items">
                <AccordionTrigger>Detalles de la orden</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-3">
                    {selectedOrder &&
                      selectedOrder.items.map(item => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">
                            {prodName(item)} x{' '}
                            <span>{(item.quantity / 1000).toFixed(1)}</span>
                          </span>
                          <CurrencyDisplay amount={item.subtotal} />
                        </li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <CurrencyDisplay amount={selectedOrder.total_amount} />
              </li>
            </ul>
          </div>

          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Informacion del cliente</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Client</dt>
                <dd>{costumer?.name || 'Desconocido'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">CI</dt>
                <dd>{costumer?.ci || 'V-0000000'}</dd>
              </div>
            </dl>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Informacion del pago</AccordionTrigger>
              <AccordionContent>
                <dl className="grid gap-3">
                  <div className="flex flex-col gap-2  ">
                    <PaymentMethodComponent
                      paymentMethod={
                        selectedOrder.payment_method as PaymentMethodType
                      }
                    />

                    <div className="flex flex-col gap-2 ">
                      <dt className="text-muted-foreground">Fecha de pago:</dt>
                      <dd className="">
                        {selectedOrder.paid_at
                          ? format(
                              formatTheHoursToClientTimeZone(
                                new Date(selectedOrder.paid_at as string)
                              ),
                              'PPPp',
                              { locale: es }
                            )
                          : 'desconocido'}
                      </dd>
                    </div>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {selectedOrder?.status === 'pending' && (
            <PayWholeOrder
              reset={() => {
                setSelectedOrder(null)
                setOrders([])
              }}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Actualizado:{' '}
            {format(
              formatTheHoursToClientTimeZone(
                new Date(selectedOrder.created_at as string)
              ),
              'PPPp',
              { locale: es }
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  ) : (
    <div className=" rounded-xl  h-full min-w-[296px] relative">
      {orders.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <MousePointerClick className="mx-auto" size={68} />
          <CardDescription className="w-[180px] text-balance text-center mt-4">
            Si deseas ver los detalles de una orden puedes hacer click sobre una
            de ellas.
          </CardDescription>
        </div>
      )}

      {orders && <PaymentMethodInfo />}
    </div>
  )
}

interface PaymentMethodComponentProps {
  paymentMethod: PaymentMethodType
}

function PaymentMethodComponent({
  paymentMethod
}: PaymentMethodComponentProps) {
  const paymentMethodDetails = PAYMENT_METHODS.find(
    pm => pm.name === paymentMethod
  )

  if (!paymentMethodDetails) {
    return (
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Metodo:</dt>
        <dt>Desconocido</dt>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">Metodo:</dt>
      <dd className="flex items-center gap-1 capitalize">
        <paymentMethodDetails.Icon className="h-4 w-4" />
        {paymentMethodDetails.name}
      </dd>
    </div>
  )
}

function PaymentMethodInfo() {
  const { orders } = useContext(OrdersManagerCtx)

  const ordersByPaymentMethod = useMemo(() => {
    const acc = orders.reduce((acc, order) => {
      const paymentType = order.payment_method as PaymentMethodType
      acc.set(paymentType, (acc.get(paymentType) || 0) + order.total_amount)
      return acc
    }, new Map<PaymentMethodType, number>())

    return Array.from(acc, ([name, total]) => ({ name, total }))
  }, [orders])

  return (
    <motion.div
      variants={fadeInAnimationVariants}
      initial="initial"
      animate="animate"
      className="grid grid-rows-4 gap-4 w-full h-full"
    >
      {ordersByPaymentMethod.map(method => (
        <PaymentItem
          key={method.name}
          name={method.name}
          total={method.total || 0}
        />
      ))}
    </motion.div>
  )
}
interface PaymentItemProps {
  name: PaymentMethodType
  total: number
}

function PaymentItem({ name, total }: PaymentItemProps) {
  const paymentMethodDetails = PAYMENT_METHODS.find(pm => pm.name === name) || {
    name: 'Desconocido',
    Icon: Clock,
    styles:
      'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-400'
  }

  return (
    <motion.div
      variants={fadeInAnimationVariants}
      initial="initial"
      animate="animate"
    >
      <Card
        className={cn(
          'flex gap-2 flex-col-reverse h-full border-2 items-center justify-center shadow-none',
          paymentMethodDetails.styles
        )}
      >
        <div className="flex flex-row gap-2 justify-center items-center ">
          <CardTitle className="capitalize">{name ?? 'Fiado'}</CardTitle>
          <paymentMethodDetails.Icon size={20} />
        </div>
        <div className={cn('flex justify-center items-center ')}>
          <CurrencyDisplay className="text-2xl font-bold" amount={total} />
        </div>
      </Card>
    </motion.div>
  )
}
