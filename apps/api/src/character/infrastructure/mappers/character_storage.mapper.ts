import { Id } from '#shared/id/domain/models/id'
import { Character } from '#character/domain/models/character'
import CharacterEntity from '#character/infrastructure/entities/character'

export class CharacterStorageMapper {
  static fromLucid(newCharacter: CharacterEntity): Character {
    return new Character({
      id: new Id(newCharacter.id.toString()),
      name: newCharacter.name,
      userId: new Id(newCharacter.userId.toString()),
      promotionId: new Id(newCharacter.promotionId.toString()),
      berries: newCharacter.berries,
      skin: newCharacter.skin,
    })
  }
}
