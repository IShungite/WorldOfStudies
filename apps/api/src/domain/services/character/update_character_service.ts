import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { Id } from '#domain/models/id/id'
import { Character, UpdateCharacterDto } from '#domain/models/character/character'
import { CharacterNotFoundException } from '#domain/models/character/character_not_found.exception'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateCharacterService {
  constructor(readonly charactersRepository: ICharactersRepository) {}

  async execute(characterId: Id, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.charactersRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    const newCharacter = new Character({
      id: character.id,
      name: updateCharacterDto.name ?? character.name,
      userId: character.userId,
    })

    return this.charactersRepository.save(newCharacter)
  }
}
