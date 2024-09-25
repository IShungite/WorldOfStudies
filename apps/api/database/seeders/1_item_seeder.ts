import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Id } from '#shared/id/domain/models/id'
import app from '@adonisjs/core/services/app'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { ItemType } from '#shared/enums/item_type'
import { Item } from '#item/domain/models/item'

export const items: Item[] = [
  new Item({
    id: new Id('1'),
    name: 'Assassin',
    type: ItemType.Skin,
    image: 'default-skin.png',
    icon: 'default-skin.png',
  }),
  new Item({
    id: new Id('2'),
    name: 'Ange',
    type: ItemType.Skin,
    image: 'skin1.png',
    icon: 'skin1.png',
  }),
  new Item({
    id: new Id('3'),
    name: 'Barde',
    type: ItemType.Skin,
    image: 'skin2.png',
    icon: 'skin2.png',
  }),
  new Item({
    id: new Id('4'),
    name: 'Combattante',
    type: ItemType.Skin,
    image: 'skin3.png',
    icon: 'skin3.png',
  }),
  new Item({
    id: new Id('5'),
    name: 'Berserker',
    type: ItemType.Skin,
    image: 'skin4.png',
    icon: 'skin4.png',
  }),
  new Item({
    id: new Id('6'),
    name: 'Repas gratuit',
    type: ItemType.Misc,
    image: 'icon-ticket.png',
    icon: 'icon-ticket.png',
  }),
  new Item({
    id: new Id('7'),
    name: 'Cadeau mystère',
    type: ItemType.Misc,
    image: 'icon-gift.png',
    icon: 'icon-gift.png',
  }),
  new Item({
    id: new Id('8'),
    name: 'Boisson gratuite',
    type: ItemType.Misc,
    image: 'icon-drink.png',
    icon: 'icon-drink.png',
  }),
]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IItemRepository)
    await Promise.all(items.map((item) => repo.save(item)))
  }
}
