import { formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { domain } from 'wailsjs/go/models'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  // second: 'numeric',
  hour12: false // Cambiar a true para formato de 12 horas
}

export const columns: ColumnDef<domain.Order>[] = [
  {
    accessorKey: 'id',
    header: 'Id'
  },
  {
    accessorKey: 'costumer_id',
    header: () => <div className="">costumer_id</div>,
    cell: ({ row }) => {
      const costumer =
        (row.getValue('costumer_id') as number) || 'cliente no resgistrado'

      return <div className=" font-medium">{costumer}</div>
    }
  },
  {
    accessorKey: 'created_at',
    header: () => <div className="">created_at</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div className=" font-medium">{formatDate(date)}</div>
    }
  },
  {
    accessorKey: 'updated_at',
    header: () => <div className="">updated_at</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'))
      return <div className=" font-medium">{formatDate(date)}</div>
    }
  },
  {
    accessorKey: 'payment_method',
    header: 'payment_method'
  },
  {
    accessorKey: 'status',
    header: 'status'
  },
  {
    accessorKey: 'paid_at',
    header: () => <div className="">paid_at</div>,
    cell: ({ row }) => {
      const paidAt = row.getValue('paid_at')
      return paidAt ? (
        <div className=" font-medium">
          {formatDate(new Date(paidAt as string))}
        </div>
      ) : (
        <div className=" font-medium">
          no pagado
        </div>
      )
    }
  },
  {
    accessorKey: 'total_amount',
    header: () => <div className="">total_amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_amount'))
      const formatted = new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className=" font-medium">{formatted}</div>
    }
  }
]
