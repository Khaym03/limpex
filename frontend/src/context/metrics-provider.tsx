import { createContext, ReactNode, useContext, useState } from 'react'
import { domain } from 'wailsjs/go/models'

type MetricsCtxType = {
  orders: domain.Order[]
  setOrders: React.Dispatch<React.SetStateAction<domain.Order[]>>
}

const defaultValue: MetricsCtxType = {
  orders: [],
  setOrders: () => {}
}

export const MetricsCtx = createContext<MetricsCtxType>(defaultValue)

interface MetricsProviderProps {
  children: ReactNode
}

export default function MetricsProvider({
  children
}: MetricsProviderProps) {
  const [orders, setOrders] = useState<domain.Order[]>([])

  return (
    <MetricsCtx.Provider
      value={{
        orders,
        setOrders
      }}
    >
      {children}
    </MetricsCtx.Provider>
  )
}

export function useMetrics() {
  const context = useContext(MetricsCtx)
  if (context === undefined)
    throw new Error("useMetrics must be used within a MetricsProvider")

  return context
}
