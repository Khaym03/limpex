import { CurrencyCtx } from '@/context/currency-provider'
import { useContext } from 'react'
import { Switch } from './ui/switch'
import { DollarSign } from 'lucide-react'
import { Label } from './ui/label'

export default function CurrencyToggleButton() {
  const { toggleCurrency, currency } = useContext(CurrencyCtx)

  return (
    <div className="flex flex-col items-center mt-auto">
      <Label htmlFor="currency-switch" className={`mb-2 ${
        currency === 'USD' ?
        '' : 'text-muted-foreground'
      }`}>
        {' '}
        <DollarSign />
      </Label>
      <Switch
        id="currency-switch"
        onClick={toggleCurrency}
        className="mt-auto"
      ></Switch>
    </div>
  )
}
