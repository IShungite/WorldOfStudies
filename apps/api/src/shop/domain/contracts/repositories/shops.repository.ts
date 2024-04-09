import { Shop } from '../../models/shop.js'
import { Id } from '../../../../shared/id/domain/models/id.js'

export abstract class IShopsRepository {
  abstract save(shop: Shop): Promise<Shop>
  abstract getBySchoolId(schoolId: Id): Promise<Shop | null>
  abstract deleteById(shopId: Id): Promise<void>
  abstract empty(): Promise<void>
}
