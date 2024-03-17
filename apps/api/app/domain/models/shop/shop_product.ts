import { Price } from '#domainModels/shop/price'

export type CreateShopProductDto = {
  name: string
  price: number
}

type ShopProductProps = {
  name: string
  price: Price
}

export class ShopProduct {
  readonly name: string
  readonly price: Price

  constructor({ name, price }: ShopProductProps) {
    this.name = name
    this.price = price
  }
}
