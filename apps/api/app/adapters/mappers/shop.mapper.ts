import { Shop } from '#domainModels/shop/shop'

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
}
