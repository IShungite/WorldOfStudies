import { Character } from '#domainModels/character/character'
import CharacterEntity from '#models/character'
import { Id } from '#domainModels/id/id'

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

  static fromLucid(newCharacter: CharacterEntity): Character {
    return new Character({
      id: new Id(newCharacter.id.toString()),
      name: newCharacter.name,
      userId: new Id(newCharacter.userId.toString()),
    })
  }
}
