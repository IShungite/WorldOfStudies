import { Shop } from '#domainModels/shop/shop'
import { Id } from '#domainModels/id/id'

export abstract class IShopsRepository {
  abstract save(shop: Shop): Promise<Shop>
  abstract getBySchoolId(schoolId: Id): Promise<Shop | null>
  abstract empty(): Promise<void>
}
