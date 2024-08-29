import { OrderStatus } from '@/config/app-config'
import { getUserTimeZone } from '@/lib/utils'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { domain } from 'wailsjs/go/models'
import {
  ListOrders,
  ListOrdersByDate,
  ListOrdersByDateRange,
  ListOrdersByStatus
} from 'wailsjs/go/sales/Sales'

type OrderMangerCtxType = {
  selectedOrder: domain.Order | null
  setSelectedOrder: React.Dispatch<React.SetStateAction<domain.Order | null>>
  orders: domain.Order[]
  setOrders: React.Dispatch<React.SetStateAction<domain.Order[]>>
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  dateRange: DateRange | undefined
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  allOrders: () => Promise<void>
  queryOrdersByDate: () => Promise<void>
  queryOrdersByDateRange: () => Promise<void>
  queryOrderByStatus: (status: OrderStatus) => Promise<void>

}

const defaultValue: OrderMangerCtxType = {
  selectedOrder: null,
  setSelectedOrder: () => {},
  orders: [],
  setOrders: () => {},
  date: new Date(),
  setDate: () => {},
  allOrders: async () => {},
  dateRange: {
    from: undefined,
    to: undefined
  },
  setDateRange: () => {},
  queryOrdersByDate: async () => {},
  queryOrdersByDateRange: async () => {},
  queryOrderByStatus: async () => {},
}

export const OrdersManagerCtx = createContext<OrderMangerCtxType>(defaultValue)

interface OrdersMangerProviderProps {
  children: ReactNode
}

export default function OrdersMangerProvider({
  children
}: OrdersMangerProviderProps) {
  const [selectedOrder, setSelectedOrder] = useState<domain.Order | null>(null)
  const [orders, setOrders] = useState<domain.Order[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const allOrders = async () => {
    setOrders((await ListOrders()) ?? [])
    setSelectedOrder(null)
  }

  const queryOrdersByDate = async () => {
    if (!date) return

    const today: domain.DateArg = new domain.DateArg({
      date: date.toISOString(),
      client_time_zone: getUserTimeZone()
    })

    const data = (await ListOrdersByDate(today)) ?? []

    setOrders(data)
    setSelectedOrder(null)
  }

  useEffect(() => {
    queryOrdersByDate()
  }, [date])

  const queryOrdersByDateRange = async () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return

    const from: domain.DateArg = new domain.DateArg({
      date: dateRange?.from.toISOString(),
      client_time_zone: getUserTimeZone()
    })

    const to: domain.DateArg = new domain.DateArg({
      date: dateRange.to.toISOString(),
      client_time_zone: getUserTimeZone()
    })

    const data = (await ListOrdersByDateRange(from, to)) ?? []

    setOrders(data)
  }

  const queryOrderByStatus = async (status: OrderStatus) => {
    const data = (await ListOrdersByStatus(status)) ?? []

    setOrders(data)
  }

  return (
    <OrdersManagerCtx.Provider
      value={{
        selectedOrder,
        setSelectedOrder,
        orders,
        setOrders,
        date,
        setDate,
        dateRange,
        setDateRange,
        allOrders,
        queryOrdersByDate,
        queryOrdersByDateRange,
        queryOrderByStatus
      }}
    >
      {children}
    </OrdersManagerCtx.Provider>
  )
}
