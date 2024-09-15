import ItemEntity from '#item/infrastructure/entities/item'
import { Item } from '#item/domain/models/item'
import { Id } from '#shared/id/domain/models/id'

export class ItemStorageMapper {
  static fromLucid(lucidItem: ItemEntity): Item {
    return new Item({
      id: new Id(lucidItem.id.toString()),
      name: lucidItem.name,
      type: lucidItem.type,
      image: lucidItem.image,
    })
  }
}
