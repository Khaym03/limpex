// import { DatePicker } from '@/components/date-picker'
import { domain } from 'wailsjs/go/models'
import { ListOrders, ListOrdersByDate } from 'wailsjs/go/sales/Sales'
import DataTable from './data-table'
import { columns } from './columns'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TodayInfo() {
  const [data, setData] = useState<domain.Order[]>([])

  const allOrders = async () => {
    setData(await ListOrders())
  }

  const todayOrders = async () => {
    const date = new Date()

    date.setHours(date.getHours() + 4)
    const today: domain.DateArg = new domain.DateArg({
      date: date.toISOString()
    })
    
    const data = await ListOrdersByDate(today)
  
    setData(data)
  }
  return (
    <section className="p-10">
      <header>
        <Button variant={'outline'} onClick={allOrders}>
          todas las ordenes
        </Button>
        <Button variant={'outline'} onClick={todayOrders}>
          ordenes de hoy
        </Button>
      </header>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  )
}
