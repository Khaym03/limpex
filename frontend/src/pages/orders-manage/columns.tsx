import CurrencyDisplay from '@/components/currency-display'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { domain } from 'wailsjs/go/models'
import { GetCustomerById } from 'wailsjs/go/sales/Sales'

export const columns: ColumnDef<domain.Order>[] = [
  {
    accessorKey: 'customer_id',
    header: () => <div className="">Cliente</div>,
    cell: ({ row }) => {
      const customerExist = row.getValue('customer_id') as number
      const [customer, setCustomer] = useState<domain.Customer | null>(null)

      useEffect(() => {
        const fetchCustomer = async () => {
          if (customerExist) {
            setCustomer(await GetCustomerById(customerExist))
          }
        }

        fetchCustomer()
      })

      return <Customer customer={customer} />
    }
  },
  {
    accessorKey: 'created_at',
    header: () => <div>Fecha creacion</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className="font-medium">
          {formatDate(date)}
        </div>
      )
    }
  },
  {
    accessorKey: 'status',
    header: () => <div>Estatus</div>,
    cell: ({ row }) => {
      return <OrderStatus status={row.getValue('status')} />
    }
  },
  {
    accessorKey: 'total_amount',
    header: () => <div>Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_amount'))
      return <CurrencyDisplay amount={amount} />
    }
  }
]

interface CustomerProps {
  customer: domain.Customer | null
}

function Customer({ customer }: CustomerProps) {
  const renderCostumerInfo = (name: string, ci: string) => (
    <div className="flex flex-col font-medium">
      <span className="text-sm capitalize">{name}</span>
      <span className="text-muted-foreground text-xs">{`V-${ci}`}</span>
    </div>
  )

  return (
    <>
      {customer
        ? renderCostumerInfo(customer.name, customer.ci)
        : renderCostumerInfo('desconocido', '0000000')}
    </>
  )
}

interface OrderStatusProps {
  status: 'paid' | 'pending'
}

function OrderStatus({ status }: OrderStatusProps) {
  const renderStatus = () => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="text-xs bg-emerald-500 dark:bg-emerald-400 pointer-events-none">
            Pagado
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="text-xs text-amber-800 bg-amber-300 dark:bg-amber-300 pointer-events-none">
            Pendiente
          </Badge>
        )
      default:
        return (
          <Badge className="text-xs pointer-events-none" variant="secondary">
            Unknown Status
          </Badge>
        )
    }
  }

  return <>{renderStatus()}</>
}
