package ports

type ProductStore interface {
	CreateProduct(name string, price float64) (int64, error)
	CreateCleaningProduct(name string, price float64, color string) error
	GetProducts()
}
