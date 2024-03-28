import { Shop } from '#domain/models/shop/shop'
import ShopEntity from '#infrastructure/models/shop/shop'
import { Id } from '#domain/models/id/id'
import { ShopCategory } from '#domain/models/shop/shop_category'
import { ShopProduct } from '#domain/models/shop/shop_product'
import { Price } from '#domain/models/shop/price'

export class ShopMapper {
  static toResponse(shop: Shop) {
    return {
      id: shop.id.toString(),
      schoolId: shop.schoolId.toString(),
      categories: shop.categories.map((category) => ({
        name: category.name,
        products: category.products.map((product) => ({
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
                  name: productEntity.name,
                  price: new Price(productEntity.price),
                })
            ),
          })
      ),
    })
  }
}
