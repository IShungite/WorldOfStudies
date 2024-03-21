import { Price } from '#domainModels/shop/price'
import { Id } from '#domainModels/id/id'

export type CreateShopProductDto = {
  name: string
  price: Price
}

type ShopProductProps = {
  id?: Id
  name: string
  price: Price
}

export class ShopProduct {
  readonly id: Id
  readonly name: string
  readonly price: Price

  constructor({ id, name, price }: ShopProductProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.price = price
  }
}
