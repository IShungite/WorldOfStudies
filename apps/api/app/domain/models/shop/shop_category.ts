import { CreateShopProductDto, ShopProduct } from '#domainModels/shop/shop_product'
import { Id } from '#domainModels/id/id'

export type CreateShopCategoryDto = {
  name: string
  products: CreateShopProductDto[]
}

type ShopCategoryProps = {
  readonly id?: Id
  readonly name: string
  readonly products: ShopProduct[]
}

export class ShopCategory {
  readonly id: Id
  readonly name: string
  readonly products: ShopProduct[]

  constructor({ id, name, products }: ShopCategoryProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.products = products
  }
}
