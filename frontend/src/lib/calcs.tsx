import { domain } from 'wailsjs/go/models'

/**
 * You get the full benefit from paid orders.
 * @param {domain.Order[]} orders
 * @param {domain.Product[]} products
 * @returns {number}
 */
export function calculateTotalProfit(
  orders: domain.Order[],
  products: domain.Product[]
): number {
  const paidOrders = orders.filter(order => order.status === 'paid')
  const profitMap = new Map<number, number>()

  paidOrders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.product_id)
      if (!product) {
        console.error(`Product not found for ID ${item.product_id}`)
        return
      }

      const profitQuotient = calcProfitQuotient(product)
      const productId = item.product_id

      const currentProfit = profitMap.get(productId) || 0
      profitMap.set(productId, currentProfit + item.subtotal * profitQuotient)
    })
  })

  return Array.from(profitMap.values()).reduce((a, b) => a + b, 0)
}

/**
 * Calculate the coefficient of profit for a product.
 * @param {domain.Product} product
 * @returns {number}
 */

export function calcProfitQuotient(product: domain.Product): number {
  if (product.purchase_price === 0) {
    throw new Error('sale_price cant not be 0')
  }
  return (product.sale_price - product.purchase_price) / product.purchase_price
}

/**
 * Calculates the average daily sales.
 * @param {domain.Order[]} orders - Array of objects representing the orders.
 * @returns {number} Average daily sales.
 */
export function calculateAverageDailySales(orders: domain.Order[]): number {
  // Extract unique dates and sum sales by day
  const salesByDay: { [date: string]: number } = {}
  orders.forEach(order => {
    let data = order.created_at as string

    const date = data.split('T')[0] // Extract date without time
    if (!salesByDay[date]) {
      salesByDay[date] = 0
    }
    salesByDay[date] += order.total_amount
  })

  // Calculate the average daily sales
  const totalSales = Object.values(salesByDay).reduce((a, b) => a + b, 0)
  const numberOfDays = Object.keys(salesByDay).length
  const averageDailySales = totalSales / numberOfDays

  return averageDailySales
}
