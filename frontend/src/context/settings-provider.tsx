import { useToast } from '@/components/ui/use-toast'
import { createContext, useContext, useState } from 'react'
import { DeleteCustomer } from 'wailsjs/go/sales/Sales'

type SettingsCtxType = {
  customerId: number
  setCustomerId: React.Dispatch<React.SetStateAction<number>>
  deleteCustomer: () => Promise<void>
}

const defaultValue: SettingsCtxType = {
  customerId: 0,
  setCustomerId: () => {},
  deleteCustomer: async () => {}
}

export const SettingsCtx = createContext<SettingsCtxType>(defaultValue)

export default function SettingsProvider({ children }: any) {
  const [customerId, setCustomerId] = useState<number>(0)

  const { toast } = useToast()

  const deleteCustomer = async () => {
    if (customerId === 0) return

    const msg = await DeleteCustomer(customerId)
    if (msg.success) {
      const { dismiss } = toast({
        title: 'Borrado exitosamente'
      })

      setTimeout(dismiss, 3000)
    } else {
      toast({
        title: 'Error',
        description: msg.error
      })
    }
  }

  return (
    <SettingsCtx.Provider
      value={{
        customerId,
        setCustomerId,
        deleteCustomer
      }}
    >
      {children}
    </SettingsCtx.Provider>
  )
}

export function useSettings() {
    const context = useContext(SettingsCtx)
    if (context === undefined)
      throw new Error("useSettings must be used within a SettingsProvider")
  
    return context
  }
