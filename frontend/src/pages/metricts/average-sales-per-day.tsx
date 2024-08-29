import CurrencyDisplay from '@/components/currency-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMetrics } from '@/context/metrics-provider'
import { calculateAverageDailySales } from '@/lib/calcs'
import { useMemo } from 'react'

export default function AverageSalesPerDay() {
  const { orders } = useMetrics()

  const avr = useMemo(() => calculateAverageDailySales(orders), [orders])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promedio de ventas por dia</CardTitle>
      </CardHeader>
      <CardContent>
        <CurrencyDisplay amount={avr || 0} />
      </CardContent>
    </Card>
  )
}
