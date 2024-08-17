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

export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }

  const VENEZUELA_UTC = 4

  date.setHours(date.getHours() - VENEZUELA_UTC)

  return date.toLocaleString('es-VE', options)
}
