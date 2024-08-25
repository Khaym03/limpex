import { useContext } from 'react'
import DataTable from './data-table'
import OrderDetails from './order-details'
import { OrdersManagerCtx } from '@/context/orders-manager-provider'
import { columns } from './columns'

export default function Content() {
  const { orders } = useContext(OrdersManagerCtx)

  return (
    <div className="flex gap-8 mt-4 h-[553px]">
      <DataTable columns={columns} data={orders} />

      <OrderDetails />
    </div>
  )
}
