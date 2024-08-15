import { Price } from '#shop/domain/models/price'
import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'

export type CreateShopProductDto = {
  itemId: Id
  price: Price
}

export type UpdateShopProductDto = {
  itemId?: Id
  price?: Price
}

type ShopProductProps = {
  id?: Id
  item: Item
  price: Price
}

export class ShopProduct {
  readonly id: Id
  readonly item: Item
  readonly price: Price

  constructor({ id, item, price }: ShopProductProps) {
    this.id = id ?? Id.factory()
    this.item = item
    this.price = price
  }
}
