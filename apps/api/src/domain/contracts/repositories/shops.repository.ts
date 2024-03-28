import { Shop } from '#domain/models/shop/shop'
import { Id } from '#domain/models/id/id'

export abstract class IShopsRepository {
  abstract save(shop: Shop): Promise<Shop>
  abstract getBySchoolId(schoolId: Id): Promise<Shop | null>
  abstract deleteById(shopId: Id): Promise<void>
  abstract empty(): Promise<void>
}
