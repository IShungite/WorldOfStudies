import { Id } from '#shared/id/domain/models/id'

type CharacterProps = {
  id?: Id
  name: string
  userId: Id
}

export type CreateCharacterDto = {
  name: string
  userId: Id
}

export type UpdateCharacterDto = {
  name?: string
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
