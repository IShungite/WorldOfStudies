import { CreateShopProductDto, ShopProduct } from './shop_product.js'
import { Id } from '../../../shared/id/domain/models/id.js'

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
