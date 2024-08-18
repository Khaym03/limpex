import { formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { domain } from 'wailsjs/go/models'

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
        (row.getValue('costumer_id') as number) || 'no resgistrado'

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
          a espera del pago
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
