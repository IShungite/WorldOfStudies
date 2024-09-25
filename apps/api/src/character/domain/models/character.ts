import { Id } from '#shared/id/domain/models/id'

type CharacterProps = {
  id?: Id
  name: string
  userId: Id
  promotionId: Id
  berries: number
  skin: string
}

export type CreateCharacterDto = {
  name: string
  userId: Id
  promotionId: Id
  skin: string
}

export type UpdateCharacterDto = {
  name?: string
  berries?: number
  skin?: string
}

export class Character {
  readonly id: Id
  readonly name: string
  readonly userId: Id
  readonly promotionId: Id
  readonly berries: number
  readonly skin: string

  constructor({ id, name, userId, promotionId, berries, skin }: CharacterProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.userId = userId
    this.promotionId = promotionId
    this.berries = berries
    this.skin = skin
  }
}
