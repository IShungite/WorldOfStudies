import { ItemType } from '#shared/enums/item_type'
import { Id } from '#shared/id/domain/models/id'

type ItemProps = {
  id?: Id
  name: string
  type: ItemType
  image: string
}

export class Item {
  readonly id: Id
  readonly name: string
  readonly type: ItemType
  readonly image: string

  constructor({ id, name, type, image }: ItemProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.type = type
    this.image = image
  }
}
