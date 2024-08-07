import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

interface IProductSelect  {
    products: Product[],
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
          <SelectItem key={p.id} value={p.id.toString()}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
