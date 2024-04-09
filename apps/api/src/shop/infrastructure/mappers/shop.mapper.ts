import { Shop } from '../../domain/models/shop.js'
import ShopEntity from '../entities/shop.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { ShopCategory } from '../../domain/models/shop_category.js'
import { ShopProduct } from '../../domain/models/shop_product.js'
import { Price } from '../../domain/models/price.js'

export class ShopMapper {
  static toResponse(shop: Shop) {
    return {
      id: shop.id.toString(),
      schoolId: shop.schoolId.toString(),
      categories: shop.categories.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        products: category.products.map((product) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price.toNumber(),
        })),
      })),
    }
  }

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
                  name: productEntity.name,
                  price: new Price(productEntity.price),
                })
            ),
          })
      ),
    })
  }
}
