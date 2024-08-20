import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AddItemToCart } from 'wailsjs/go/sales/Sales'
import { domain } from 'wailsjs/go/models'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addToShoppingCart(product: Product, quantity: number) {
  const newOrderItem: domain.OrderItemPayload = {
    product_id: product.id,
    quantity,
    unit_price: product.sale_price,
    subtotal: product.sale_price * (quantity / 1000)
  }

  AddItemToCart(newOrderItem)
}

export function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function formatTheHoursToClientTimeZone(date: Date): Date {
  const clone = new Date(date)

  const localOffset = clone.getTimezoneOffset() / 60

  clone.setHours(clone.getHours() - localOffset)

  return clone
}

export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: getUserTimeZone()
  }

  return formatTheHoursToClientTimeZone(date).toLocaleString('es-VE', options)
}

export function formatCurrecy(amount: number) {
  return new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
