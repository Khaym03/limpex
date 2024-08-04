import { useEffect, useState } from "react"
import { GetCostumers } from "wailsjs/go/sales/Sales"

export const useCostumers = () => {
    const [costumers, setCostumers] = useState<Costumer[]>([])
  
    useEffect(() => {
      GetCostumers().then(p => setCostumers(p))
    }, [])
  
    return {costumers}
  }