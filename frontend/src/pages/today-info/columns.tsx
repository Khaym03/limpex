import { Badge } from '@/components/ui/badge'
import { formatCurrecy, formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { domain } from 'wailsjs/go/models'
import { GetCostumerById } from 'wailsjs/go/sales/Sales'

export const columns: ColumnDef<domain.Order>[] = [
  {
    accessorKey: 'costumer_id',
    header: () => <div className="">Cliente</div>,
    cell: ({ row }) => {
      const costumerExist = row.getValue('costumer_id') as number
      const [costumer, setCostumer] = useState<domain.Costumer | null>(null)

      useEffect(() => {
        const fetchCostumer = async () => {
          if (costumerExist) {
            setCostumer(await GetCostumerById(costumerExist))
          }
        }

        fetchCostumer()
      })

      return <Costumer costumer={costumer} />
    }
  },
  {
    accessorKey: 'created_at',
    header: () => <div>Fecha creacion</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div
          onClick={() => console.log('x')}
          className=" font-medium"
        >
          {formatDate(date)}
        </div>
      )
    }
  },
  // {
  //   accessorKey: 'updated_at',
  //   header: () => <div className="">updated_at</div>,
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue('updated_at'))
  //     return <div className=" font-medium">{formatDate(date)}</div>
  //   }
  // },
  // {
  //   accessorKey: 'payment_method',
  //   header: 'Metodo de pago',
  //   cell: ({ row }) => {
  //     return (
  //       <div className="capitalize font-medium">
  //         {row.getValue('payment_method')}
  //       </div>
  //     )
  //   }
  // },
  {
    accessorKey: 'status',
    header: 'status',
    cell: ({ row }) => {
      return <OrderStatus status={row.getValue('status')} />
    }
  },
  {
    accessorKey: 'total_amount',
    header: () => <div className="">total_amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_amount'))
      return <div className=" font-medium">{formatCurrecy(amount)}</div>
    }
  }
]

interface CostumerProps {
  costumer: domain.Costumer | null
}

function Costumer({ costumer }: CostumerProps) {
  const renderCostumerInfo = (name: string, ci: string) => (
    <div className="flex flex-col font-medium">
      <span className="text-sm capitalize">{name}</span>
      <span className="text-muted-foreground text-xm">{`V-${ci}`}</span>
    </div>
  )

  return (
    <>
      {costumer
        ? renderCostumerInfo(costumer.name, costumer.ci)
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
          <Badge className="text-xs bg-green-600 pointer-events-none">
            Pagado
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="text-xs bg-yellow-400 pointer-events-none">
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
