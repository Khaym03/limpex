interface CleaningProduct  {
    Id: number,
    Name: string,
    Price: number,
    CleaningProductData: {
        color: string
    }
}

interface Message {
    Success: boolean
    Error: string
}