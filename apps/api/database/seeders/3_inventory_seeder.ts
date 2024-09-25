import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { InventoryItem } from '#inventory/domain/models/inventory_item'
import { items } from '#database/seeders/1_item_seeder'
import { characters } from '#database/seeders/3_character_seeder'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IInventoriesRepository)

    const inventories: Inventory[] = [
      new Inventory({
        id: new Id('1'),
        items: [
          new InventoryItem({ id: new Id('1'), item: items[0] }),
          new InventoryItem({ id: new Id('2'), item: items[1] }),
        ],
      }),
      new Inventory({
        id: new Id('2'),
        items: [
          new InventoryItem({ id: new Id('3'), item: items[0] }),
          new InventoryItem({ id: new Id('4'), item: items[1] }),
          new InventoryItem({ id: new Id('5'), item: items[2] }),
        ],
      }),
      new Inventory({
        id: new Id('3'),
        items: [
          new InventoryItem({ id: new Id('6'), item: items[0] }),
          new InventoryItem({ id: new Id('7'), item: items[3] }),
          new InventoryItem({ id: new Id('8'), item: items[4] }),
        ],
      }),
    ]

    await Promise.all(
      inventories.map((inventory, index) => {
        const characterId = characters[index].id
        return repo.saveForCharacter(characterId, inventory)
      })
    )
  }
}
