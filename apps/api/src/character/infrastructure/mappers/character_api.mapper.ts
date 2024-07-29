import { Character } from '#character/domain/models/character'
import type { CharacterListResponse, CharacterResponse } from '@world-of-studies/api-types'

export class CharacterApiMapper {
  static toResponse(character: Character): CharacterResponse {
    return {
      result: {
        id: character.id.toString(),
        name: character.name,
        userId: character.userId.toString(),
      },
    }
  }

  static toResponseList(characters: Character[]): CharacterListResponse {
    return {
      results: characters.map((character) => {
        return this.toResponse(character)
      }),
    }
  }
}
