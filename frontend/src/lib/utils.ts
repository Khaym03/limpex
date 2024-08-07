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
