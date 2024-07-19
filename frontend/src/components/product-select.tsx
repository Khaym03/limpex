import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

interface IProductSelect  {
    products: CleaningProduct[],
    onSelect: (id: number) => void
}

export function ProductSelect({ products, onSelect }:IProductSelect) {
  return (
    <Select onValueChange={id => onSelect(+id)}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccione un producto" />
      </SelectTrigger>
      <SelectContent>
        {products.map(p => (
          <SelectItem key={p.Id} value={p.Id.toString()}>
            {p.Name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
