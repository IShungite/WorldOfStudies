import { Shop } from '../../domain/models/shop.js'

export class ShopApiMapper {
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
}
