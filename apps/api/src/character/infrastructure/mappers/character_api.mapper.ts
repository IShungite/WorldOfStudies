import { Character } from '#character/domain/models/character'

export class CharacterApiMapper {
  static toResponse(character: Character) {
    return {
      result: {
        id: character.id.toString(),
        name: character.name,
        userId: character.userId.toString(),
      },
    }
  }

  static toResponseList(characters: Character[]) {
    return {
      results: characters.map((character) => {
        return this.toResponse(character)
      }),
    }
  }
}
