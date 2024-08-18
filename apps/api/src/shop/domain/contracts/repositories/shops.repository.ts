import { Id } from '#shared/id/domain/models/id'
import { Shop } from '#shop/domain/models/shop'
import { ShopProduct } from '#shop/domain/models/shop_product'

export abstract class IShopsRepository {
  abstract save(shop: Shop): Promise<Shop>
  abstract getProductById(productId: Id): Promise<ShopProduct | null>
  abstract getBySchoolId(schoolId: Id): Promise<Shop | null>
  abstract deleteById(shopId: Id): Promise<void>
  abstract empty(): Promise<void>
}
