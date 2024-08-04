import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Fingerprint, CreditCard, HandCoins } from 'lucide-react'

export default function PaymentMethod() {
  return (
    <Card className='h-max'>
      <CardHeader>
        <CardTitle>Metodos de pago</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="bio-pago" className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem
              value="bio-pago"
              id="bio-pago"
              className="peer sr-only"
            />
            <Label
              htmlFor="bio-pago"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Fingerprint className="mb-3 h-6 w-6" />
              Bio-pago
            </Label>
          </div>
          <div>
            <RadioGroupItem value="efectivo" id="efectivo" className="peer sr-only" />
            <Label
              htmlFor="efectivo"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <HandCoins className="mb-3 h-6 w-6" />
              Efectivo
            </Label>
          </div>
          <div>
            <RadioGroupItem value="tarjeta" id="tarjeta" className="peer sr-only" />
            <Label
              htmlFor="tarjeta"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-3 h-6 w-6" />
              Tarjeta
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
