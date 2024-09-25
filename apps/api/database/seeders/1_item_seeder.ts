import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { ItemType } from '#shared/enums/item_type'
import { Item } from '#item/domain/models/item'

export const items: Item[] = [
  new Item({
    id: new Id('1'),
    name: 'Default skin',
    type: ItemType.Skin,
    image: 'default-skin.png',
    icon: 'skin-icon.png',
  }),
  new Item({
    id: new Id('2'),
    name: 'Item 1',
    type: ItemType.Skin,
    image: 'skin1.png',
    icon: 'skin-icon.png',
  }),
  new Item({
    id: new Id('3'),
    name: 'Item 2',
    type: ItemType.Skin,
    image: 'skin2.png',
    icon: 'skin-icon.png',
  }),
  new Item({
    id: new Id('4'),
    name: 'Item 3',
    type: ItemType.Skin,
    image: 'skin3.png',
    icon: 'skin-icon.png',
  }),
  new Item({
    id: new Id('5'),
    name: 'Item 4',
    type: ItemType.Skin,
    image: 'skin4.png',
    icon: 'skin-icon.png',
  }),
  new Item({
    id: new Id('6'),
    name: 'Item 5',
    type: ItemType.Misc,
    image: 'les-des.png',
    icon: 'les-des.png',
  }),
  new Item({
    id: new Id('7'),
    name: 'Item 6',
    type: ItemType.Misc,
    image: 'les-des.png',
    icon: 'les-des.png',
  }),
  new Item({
    id: new Id('8'),
    name: 'Item 7',
    type: ItemType.Misc,
    image: 'les-des.png',
    icon: 'les-des.png',
  }),
]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IItemRepository)
    await Promise.all(items.map((item) => repo.save(item)))
  }
}
