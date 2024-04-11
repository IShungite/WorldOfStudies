import { Id } from '#shared/id/domain/models/id'
import { Shop } from '#shop/domain/models/shop'

export abstract class IShopsRepository {
  abstract save(shop: Shop): Promise<Shop>
  abstract getBySchoolId(schoolId: Id): Promise<Shop | null>
  abstract deleteById(shopId: Id): Promise<void>
  abstract empty(): Promise<void>
}
