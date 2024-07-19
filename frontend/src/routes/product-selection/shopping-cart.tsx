import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const invoices = [
  {
    Id: 1,
    Quantity: 1000,
    TotalPrice: 34
  },
  {
    Id: 2,
    Quantity: 1000,
    TotalPrice: 34
  },
  {
    Id: 3,
    Quantity: 1000,
    TotalPrice: 34
  },
  {
    Id: 4,
    Quantity: 1000,
    TotalPrice: 34
  }
]

export default function ShoppingCart() {
  return (
    <Card className="flex flex-grow px-3 py-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.Id}>
              <TableCell className="font-medium">{invoice.Id}</TableCell>
              <TableCell>{invoice.Quantity}</TableCell>
              <TableCell className="text-right">{invoice.TotalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  )
}
