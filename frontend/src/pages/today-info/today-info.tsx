import { domain } from 'wailsjs/go/models'
import {
  ListOrders,
  ListOrdersByDate,
  ListOrdersByDateRange,
  ListOrdersByStatus
} from 'wailsjs/go/sales/Sales'
import DataTable from './data-table'
import { columns } from './columns'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getUserTimeZone } from '@/lib/utils'
import { DatePicker } from '@/components/date-picker'
import { Search } from 'lucide-react'
import { DateRangePicker } from '@/components/date-range-picker'
import { DateRange } from 'react-day-picker'
import OrderDetails from './order-details'
import { useSpring, animated } from '@react-spring/web'
import { OrderStatus } from '@/config/app-config'
import { FileStack, FileClock } from 'lucide-react'

export default function TodayInfo() {
  const [data, setData] = useState<domain.Order[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [invalidRange, setInvalidRange] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<domain.Order | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const allOrders = async () => {
    setData((await ListOrders()) ?? [])
  }

  const queryOrdersByDate = async () => {
    if (!date) return

    const today: domain.DateArg = new domain.DateArg({
      date: date.toISOString(),
      client_time_zone: getUserTimeZone()
    })

    const data = (await ListOrdersByDate(today)) ?? []

    setData(data)
  }

  useEffect(
    () => setInvalidRange(!dateRange || !dateRange.from || !dateRange.to),
    [dateRange]
  )

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

    setData(data)
  }

  const fase = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  const queryOrderByStatus = async (status: OrderStatus) => {
    const data = (await ListOrdersByStatus(status)) ?? []

    setData(data)
  }

  return (
    <animated.section
      style={{ ...fase }}
      className="flex items-center p-10 h-screen"
    >
      <div className="container max-w-5xl">
        <header className="flex justify-between">
          <Button
            className="font-normal"
            size={'icon'}
            variant={'outline'}
            onClick={allOrders}
          >
            <FileStack />
          </Button>
          <Button
            className="font-normal"
            size={'icon'}
            variant={'outline'}
            onClick={() => queryOrderByStatus('pending')}
          >
            <FileClock />
          </Button>

          <div className="flex gap-2">
            <DatePicker date={date} setDate={setDate} />
            <Button onClick={queryOrdersByDate} size={'icon'} disabled={!date}>
              <Search size={20} />
            </Button>
          </div>

          <div className="flex gap-2">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Button
              onClick={queryOrdersByDateRange}
              size={'icon'}
              disabled={invalidRange}
            >
              <Search size={20} />
            </Button>
          </div>
        </header>
        <div className="flex gap-8 mt-4 h-[553px]">
          <DataTable
            columns={columns}
            data={data}
            setSelectedOrder={setSelectedOrder}
          />

          <OrderDetails
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            setData={setData}
          />
        </div>
      </div>
    </animated.section>
  )
}
