import { CreateShopProductDto, ShopProduct } from '#domain/models/shop/shop_product'
import { Id } from '#domain/models/id/id'

export type CreateShopCategoryDto = {
  name: string
  products: CreateShopProductDto[]
}

export type UpdateShopCategoryDto = {
  name: string
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
