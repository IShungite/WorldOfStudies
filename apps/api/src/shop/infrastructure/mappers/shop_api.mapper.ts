import { Shop } from '#shop/domain/models/shop'

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
          name: product.item.name,
          type: product.item.type,
          image: product.item.image,
          price: product.price.toNumber(),
        })),
      })),
    }
  }
}
