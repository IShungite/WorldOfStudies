import { Id } from '#shared/id/domain/models/id'
import { Price } from '#shop/domain/models/price'
import { Shop } from '#shop/domain/models/shop'
import ShopEntity from '#shop/infrastructure/entities/shop'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { Item } from '#item/domain/models/item'

export class ShopStorageMapper {
  static fromLucid(shopEntity: ShopEntity): Shop {
    return new Shop({
      id: new Id(shopEntity.id.toString()),
      schoolId: new Id(shopEntity.schoolId.toString()),
      categories: shopEntity.categories.map(
        (categoryEntity) =>
          new ShopCategory({
            id: new Id(categoryEntity.id.toString()),
            name: categoryEntity.name,
            products: categoryEntity.products.map(
              (productEntity) =>
                new ShopProduct({
                  id: new Id(productEntity.id.toString()),
                  item: new Item({
                    id: new Id(productEntity.item.id.toString()),
                    name: productEntity.item.name,
                  }),
                  price: new Price(productEntity.price),
                })
            ),
          })
      ),
    })
  }
}
