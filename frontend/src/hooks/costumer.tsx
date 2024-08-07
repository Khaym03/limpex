import { useEffect, useState } from "react"
import { GetCostumers } from "wailsjs/go/sales/Sales"
import { domain } from "wailsjs/go/models"

export const useCostumers = () => {
    const [costumers, setCostumers] = useState<domain.Costumer[]>([])
  
    useEffect(() => {
      GetCostumers().then(p => setCostumers(p))
    }, [])
  
    return {costumers}
  }