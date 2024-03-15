import { Character } from '#domainModels/character/character'

export class CharacterMapper {
  static toResponse(character: Character) {
    return {
      id: character.id.toString(),
      name: character.name,
      userId: character.userId.toString(),
    }
  }

  static toResponseList(characters: Character[]) {
    return characters.map((character) => {
      return CharacterMapper.toResponse(character)
    })
  }
}
