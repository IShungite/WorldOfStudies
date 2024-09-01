import { Id } from '#shared/id/domain/models/id'
import { Price } from '#shop/domain/models/price'
import { Item } from '#item/domain/models/item'
import ShopProductEntity from '#shop/infrastructure/entities/shop_product'
import { ShopProduct } from '#shop/domain/models/shop_product'

export class ShopProductStorageMapper {
  static fromLucid(shopProductEntity: ShopProductEntity): ShopProduct {
    return new ShopProduct({
      id: new Id(shopProductEntity.id.toString()),
      item: new Item({
        id: new Id(shopProductEntity.item.id.toString()),
        name: shopProductEntity.item.name,
        type: shopProductEntity.item.type,
      }),
      price: new Price(shopProductEntity.price),
    })
  }
}
