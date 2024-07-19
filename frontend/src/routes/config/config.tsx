import { Separator } from "@/components/ui/separator"
import { CreateProductDialog } from "@/dialogs/create-cleaning-product"
import { DeleteProductDialog } from "@/dialogs/delete-cleaning-product"

const Header = () => {
  return (
    <header>
      <h2 className="text-2xl font-bold tracking-tight">Configuracion</h2>
      <p className="text-muted-foreground">
        Aca puedes configurar varios aspectos de la app.
      </p>
    </header>
  )
}

export default function Config() {
  return (
    <div>
      <Header />
      <Separator className="my-6"/>
      <CreateProductDialog/>
      <DeleteProductDialog/>
    </div>
  )
}
