import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { Id } from '#shared/id/domain/models/id'
import { Item } from '#item/domain/models/item'
import ItemEntity from '#item/infrastructure/entities/item'
import { ItemStorageMapper } from '#item/infrastructure/mappers/item_storage.mapper'
import testUtils from '@adonisjs/core/services/test_utils'

export class LucidItemsRepository implements IItemRepository {
  async save(item: Item): Promise<Item> {
    const itemId = Number.parseInt(item.id.toString(), 10)

    await ItemEntity.updateOrCreate(
      {
        id: itemId,
      },
      {
        id: itemId,
        name: item.name,
      }
    )

    return item
  }

  async getById(itemId: Id): Promise<Item | null> {
    const item = await ItemEntity.find(itemId.toString())

    return item ? ItemStorageMapper.fromLucid(item) : null
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
