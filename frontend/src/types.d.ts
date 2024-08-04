interface CleaningProduct  {
    Id: number,
    Name: string,
    Price: number,
    CleaningProductData: {
        Color: string
    }
}

interface Costumer {
    Id: number,
    Name: string,
    CreatedAt: string,
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