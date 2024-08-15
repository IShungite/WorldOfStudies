import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'

export abstract class IItemRepository {
  abstract save(item: Item): Promise<Item>
  abstract getById(itemId: Id): Promise<Item | null>
  abstract empty(): Promise<void>
}
