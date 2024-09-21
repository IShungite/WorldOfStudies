import { Id } from '#shared/id/domain/models/id'

type CharacterProps = {
  id?: Id
  name: string
  userId: Id
  promotionId: Id
  berries: number
}

export type CreateCharacterDto = {
  name: string
  userId: Id
  promotionId: Id
}

export type UpdateCharacterDto = {
  name?: string
  berries?: number
}

export class Character {
  readonly id: Id
  readonly name: string
  readonly userId: Id
  readonly promotionId: Id
  readonly berries: number

  constructor({ id, name, userId, promotionId, berries }: CharacterProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.userId = userId
    this.promotionId = promotionId
    this.berries = berries
  }
}
