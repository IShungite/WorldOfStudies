export type ShopResponse = {
  categories: Category[]
}

export type Product = {
  id: string
  name: string
  price: number
}

export type Category = {
  id: string
  name: string
  products: Product[]
}
