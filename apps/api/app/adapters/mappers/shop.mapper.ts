import { Shop } from '#domainModels/shop/shop'
import ShopEntity from '#models/shop/shop'
import { Id } from '#domainModels/id/id'
import { ShopCategory } from '#domainModels/shop/shop_category'
import { ShopProduct } from '#domainModels/shop/shop_product'
import { Price } from '#domainModels/shop/price'

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
