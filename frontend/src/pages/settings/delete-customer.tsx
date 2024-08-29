import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useCustomers } from '@/hooks/costumer'
import { GetOrdersByCustomerAndStatus } from 'wailsjs/go/sales/Sales'
import { useSettings } from '@/context/settings-provider'

export function DeleteCustomerComponent() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const { setCustomerId } = useSettings()

  const { costumers } = useCustomers()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? costumers.find(c => c.name === value)?.name : 'Clientes...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente" />
          <CommandList>
            <CommandEmpty>No se encuentra</CommandEmpty>
            <CommandGroup>
              {costumers.map(c => (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  onSelect={async currentValue => {
                    setCustomerId(c.id)

                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === c.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {c.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
