import { Id } from '#shared/id/domain/models/id'

type ItemProps = {
  id?: Id
  name: string
}

export class Item {
  readonly id: Id
  readonly name: string

  constructor({ id, name }: ItemProps) {
    this.id = id ?? Id.factory()
    this.name = name
  }
}
