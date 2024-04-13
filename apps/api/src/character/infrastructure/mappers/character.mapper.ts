import { Id } from '#shared/id/domain/models/id'
import { Character } from '#character/domain/models/character'
import CharacterEntity from '#character/infrastructure/entities/character'

export class CharacterMapper {
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
        return CharacterMapper.toResponse(character)
      }),
    }
  }

  static fromLucid(newCharacter: CharacterEntity): Character {
    return new Character({
      id: new Id(newCharacter.id.toString()),
      name: newCharacter.name,
      userId: new Id(newCharacter.userId.toString()),
    })
  }
}
