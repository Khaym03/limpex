import CurrencyDisplay from '@/components/currency-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMetrics } from '@/context/metrics-provider'
import { useCleaningProducts } from '@/hooks/produtc'
import { calculateTotalProfit } from '@/lib/calcs'

export default function Profit() {
  const { products } = useCleaningProducts()
  const { orders } = useMetrics()

  const totalProfit = calculateTotalProfit(orders, products)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficio de este período</CardTitle>
      </CardHeader>
      <CardContent>
        <CurrencyDisplay amount={totalProfit} />
      </CardContent>
    </Card>
  )
}
