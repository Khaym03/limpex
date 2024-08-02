import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AddItemToCart } from 'wailsjs/go/sales/Sales'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addToShoppingCart(product: CleaningProduct, quantity: number) {
  const newOrderItem: OrderItemPayload = {
    ProductID: product.Id,
    Quantity: quantity,
    UnitPrice: product.Price,
    Subtotal: product.Price * (quantity / 1000)
  }

  AddItemToCart(newOrderItem)
}
