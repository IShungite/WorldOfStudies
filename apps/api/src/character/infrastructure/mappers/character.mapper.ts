import { Character } from '../../domain/models/character.js'
import CharacterEntity from '../entities/character.js'
import { Id } from '../../../shared/id/domain/models/id.js'

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
