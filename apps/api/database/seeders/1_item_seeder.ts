import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { Item } from '#item/domain/models/item'
import { ItemType } from '#shared/enums/item_type'

export const items = Array.from({ length: 7 }, (_, i) => {
  const num = `${i + 1}`
  return new Item({
    id: new Id(num),
    name: `Item ${num}`,
    type: ItemType.Misc,
  })
})

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IItemRepository)

    await Promise.all(items.map((item) => repo.save(item)))
  }
}
