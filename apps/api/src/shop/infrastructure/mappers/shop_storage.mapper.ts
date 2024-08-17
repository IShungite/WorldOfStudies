import { Id } from '#shared/id/domain/models/id'
import { Shop } from '#shop/domain/models/shop'
import ShopEntity from '#shop/infrastructure/entities/shop'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProductStorageMapper } from '#shop/infrastructure/mappers/shop_product_storage.mapper'

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
            products: categoryEntity.products.map((productEntity) =>
              ShopProductStorageMapper.fromLucid(productEntity)
            ),
          })
      ),
    })
  }
}
