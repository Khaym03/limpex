interface ProductPaylaod {
  name: string
  purchase_price: number
  sale_price: number
}

interface Product {
  id: number
  name: string
  purchase_price: number
  sale_price: number
}

interface Costumer {
  Id: number
  Name: string
  CreatedAt: string
  CI: string
}

interface Message {
  Success: boolean
  Error: string
}

interface OrderItemPayload {
  ProductID: number
  Quantity: number
  UnitPrice: number
  Subtotal: number
}

type Currency = 'USD' | 'VES'

