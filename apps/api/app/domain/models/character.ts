import { Id } from '#domainModels/id'

type CharacterProps = {
  id?: Id
  name: string
  userId: Id
}

export class Character {
  readonly id: Id
  readonly name: string
  readonly userId: Id
  constructor({ id, name, userId }: CharacterProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.userId = userId
  }
}
