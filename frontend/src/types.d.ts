interface CleaningProduct  {
    Id: number,
    Name: string,
    Price: number,
    CleaningProductData: {
        Color: string
    }
}

interface Message {
    Success: boolean
    Error: string
}