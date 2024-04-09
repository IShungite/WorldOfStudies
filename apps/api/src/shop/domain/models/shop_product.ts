import { Price } from './price.js'
import { Id } from '../../../shared/id/domain/models/id.js'

export type CreateShopProductDto = {
  name: string
  price: Price
}

export type UpdateShopProductDto = {
  name?: string
  price?: Price
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
