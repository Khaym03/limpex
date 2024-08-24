import { createContext, ReactNode, useState } from 'react'
import { domain } from 'wailsjs/go/models'

type Currency = 'USD' | 'VES'

type CurrencyCtxType = {
  currency: Currency
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
  toggleCurrency: () => void
}

const defaultValue: CurrencyCtxType = {
  currency: 'USD',
  setCurrency: () => {},
  toggleCurrency: () => { }
}

export const CurrencyCtx = createContext<CurrencyCtxType>(defaultValue)

interface CurrencyProviderProps {
  children: ReactNode
}

export default function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>('USD')

  const toggleCurrency = () => {
    setCurrency((prevCurrency: Currency) =>
      prevCurrency === 'USD' ? 'VES' : 'USD'
    )
    console.log(currency)
  }

  return (
    <CurrencyCtx.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency
      }}
    >
      {children}
    </CurrencyCtx.Provider>
  )
}
