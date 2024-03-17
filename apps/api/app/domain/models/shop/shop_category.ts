import { CreateShopProductDto, ShopProduct } from '#domainModels/shop/shop_product'

export type CreateShopCategoryDto = {
  name: string
  products: CreateShopProductDto[]
}

type ShopCategoryProps = {
  readonly name: string
  readonly products: ShopProduct[]
}

export class ShopCategory {
  readonly name: string
  readonly products: ShopProduct[]

  constructor({ name, products }: ShopCategoryProps) {
    this.name = name
    this.products = products
  }
}
