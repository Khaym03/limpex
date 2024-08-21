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
import { CreditCard, MoreVertical, MousePointerClick } from 'lucide-react'
import { domain } from 'wailsjs/go/models'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useCleaningProducts } from '@/hooks/produtc'
import { useCustomerDetails } from '@/hooks/costumer'
import { formatCurrecy, formatTheHoursToClientTimeZone } from '@/lib/utils'
import { PAYMENT_METHODS, PaymentMethodType } from '@/config/app-config'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteOrder, MarkAsPaid } from 'wailsjs/go/sales/Sales'
import { useToast } from '@/components/ui/use-toast'
import { PayWholeOrder } from '@/dialogs/pay-whole-order'

interface OrderDetailsProps {
  selectedOrder: domain.Order | null
  setSelectedOrder: React.Dispatch<React.SetStateAction<domain.Order | null>>
  setData: React.Dispatch<React.SetStateAction<domain.Order[]>>
}

export default function OrderDetails({
  selectedOrder,
  setSelectedOrder,
  setData
}: OrderDetailsProps) {
  const { products } = useCleaningProducts()
  const prodName = (item: domain.OrderItem) =>
    products?.find(p => p.id === item.product_id)?.name || '???'

  const { costumer } = useCustomerDetails(selectedOrder?.costumer_id)
  const { toast } = useToast()

  console.log(selectedOrder?.status === 'pending')

  const deleteOrder = async () => {
    if (!selectedOrder) return

    const msg = await DeleteOrder(selectedOrder.id)

    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Borrado',
        description: `Se a borrado la Order #${selectedOrder.id} correctamente.`
      })

      // Trigger a visual update
      setSelectedOrder(null)
      setData([])
      setTimeout(() => dismiss(), 2000)
    } else {
      const { dismiss } = toast({
        title: 'Error',
        description: msg.Error
      })


    }
  }

  const markOrderAsPaid = async (payment: PaymentMethodType) => {
    if (!selectedOrder) return

    const msg = await MarkAsPaid(selectedOrder.id, payment)

    if (msg.Success) {
      const { dismiss } = toast({
        title: 'Pagado',
        description: `Se a marcado como pagado la Order #${selectedOrder.id} correctamente.`
      })

      // Trigger a visual update
      setSelectedOrder(null)
      setData([])
      setTimeout(() => dismiss(), 2000)
    }
  }

  return selectedOrder ? (
    <Card className="flex flex-col overflow-hidden min-w-[296px]">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Order {`#${selectedOrder?.id}`}
          </CardTitle>
          <CardDescription>
            Fecha: {format(selectedOrder.created_at, 'PPP', { locale: es })}
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
              <DropdownMenuItem onClick={deleteOrder}>Borrar</DropdownMenuItem>
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
                        <span>{formatCurrecy(item.subtotal)}</span>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formatCurrecy(selectedOrder.total_amount)}</span>
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
                              new Date(selectedOrder.paid_at)
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
          <PayWholeOrder markOrderAsPaid={markOrderAsPaid} />
        )}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Actualizado:{' '}
          {format(
            formatTheHoursToClientTimeZone(new Date(selectedOrder.created_at)),
            'PPPp',
            { locale: es }
          )}
        </div>
      </CardFooter>
    </Card>
  ) : (
    <Card className="flex flex-col justify-center items-center h-full min-w-[296px]">
      <MousePointerClick size={68} />
      <CardDescription className="w-[180px] text-balance text-center mt-4">
        Si deseas ver los detalles de una orden puedes hacer click sobre una de
        ellas.
      </CardDescription>
    </Card>
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
