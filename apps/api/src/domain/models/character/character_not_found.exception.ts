import { Id } from '#domain/models/id/id'

export class CharacterNotFoundException extends Error {
  constructor(characterId: Id) {
    super(`Character with id ${characterId} not found`)
  }
}
