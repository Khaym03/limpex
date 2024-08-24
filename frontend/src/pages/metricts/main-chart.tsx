import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/date-range-picker'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { OrdersSummaryByDate } from 'wailsjs/go/metrics/Metrics'
import { domain } from 'wailsjs/go/models'
import { getUserTimeZone } from '@/lib/utils'
import { MetricsCtx } from '@/context/metrics-provider'
import CurrencyDisplay from '@/components/currency-display'

export const description = 'An interactive bar chart'

const chartConfig = {
  views: {
    label: 'total'
  },
  total_amount: {
    label: 'total',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

export default function MainChart() {
    const {orders, setOrders} = React.useContext(MetricsCtx)

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const summary = async () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return
    const from: domain.DateArg = new domain.DateArg({
      date: dateRange?.from.toISOString(),
      client_time_zone: getUserTimeZone()
    })

    const to: domain.DateArg = new domain.DateArg({
      date: dateRange.to.toISOString(),
      client_time_zone: getUserTimeZone()
    })

    console.log(await OrdersSummaryByDate(from, to))
    setOrders((await OrdersSummaryByDate(from, to)) ?? [])
  }

  const total = React.useMemo(
    () => orders.reduce((acc, cur) => acc + cur.total_amount, 0),
    [orders]
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex gap-2">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Button onClick={summary} size={'icon'}>
              <Search size={20} />
            </Button>
          </div>
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {['total_amount'].map(key => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  <CurrencyDisplay amount={total}/>
                  {/* {formatCurrecy(total)} */}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={orders}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  }}
                />
              }
            />
            <Bar dataKey={'total_amount'} fill={`var(--color-${'total_amount'})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}