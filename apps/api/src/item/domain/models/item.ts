import { ItemType } from '#shared/enums/item_type'
import { Id } from '#shared/id/domain/models/id'

type ItemProps = {
  id?: Id
  name: string
  type: ItemType
  image: string
  icon: string
}

export class Item {
  readonly id: Id
  readonly name: string
  readonly type: ItemType
  readonly image: string
  readonly icon: string

  constructor({ id, name, type, image, icon }: ItemProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.type = type
    this.image = image
    this.icon = icon
  }
}
