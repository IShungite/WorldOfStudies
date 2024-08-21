export type Product = {
  id: string
  name: string
  price: number
}

export type ShopCategory = {
  id: string
  name: string
  products: Product[]
}
