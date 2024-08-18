import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { SalesCtx } from '@/context/sales-provider'
import { useCleaningProducts } from '@/hooks/produtc'
import { CreditCard } from 'lucide-react'
import { useContext } from 'react'
import { domain } from 'wailsjs/go/models'
import { SaveOrder } from 'wailsjs/go/sales/Sales'



export default function Preorder() {
  const { cartItems, save } = useContext(SalesCtx)
  const { products } = useCleaningProducts()

  const total = () => cartItems.reduce((a, b) => a + b.subtotal, 0).toFixed(2)

  const prodName = (item: domain.OrderItemPayload) =>
    products?.find(p => p.id === item.product_id)?.name || ''

  return (
    <Card className="flex flex-col overflow-hidden md:w-[336px] lg:w-[336px]">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Order
          </CardTitle>
          {/* <CardDescription>Date: November 23, 2023</CardDescription> */}
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm h-full">
        <div className="grid gap-3">
          <div className="font-semibold">Detalles de al orden</div>
          <ul className="grid gap-3">
            {cartItems &&
              cartItems.map((item) => (
                <Item key={item.product_id} item={item} prodName={prodName(item)} />
              ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${total()}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="border-t py-4 flex items-end justify-end">
        <Button onClick={() => save()} disabled={cartItems.length < 1}>
          Archivar
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ItemProps {
  item: domain.OrderItemPayload
  prodName: string
}

function Item({ item, prodName }: ItemProps) {
  return (
    <li key={item.product_id} className="flex items-center justify-between">
      <span className="text-muted-foreground">
        {prodName} x <span>{item.quantity / 1000}</span>
      </span>
      <span>${item.subtotal.toFixed(2)}</span>
    </li>
  )
}
