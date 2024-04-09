import { Id } from '../../../shared/id/domain/models/id.js'

export class CharacterNotFoundException extends Error {
  constructor(characterId: Id) {
    super(`Character with id ${characterId} not found`)
  }
}
