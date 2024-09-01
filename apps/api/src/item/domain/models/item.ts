import { ItemType } from '#shared/enums/item_type'
import { Id } from '#shared/id/domain/models/id'

type ItemProps = {
  id?: Id
  name: string
  type: ItemType
}

export class Item {
  readonly id: Id
  readonly name: string
  readonly type: ItemType

  constructor({ id, name, type }: ItemProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.type = type
  }
}
