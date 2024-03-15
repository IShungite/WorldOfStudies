import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { Id } from '#domainModels/id/id'
import { Character, UpdateCharacterDto } from '#domainModels/character/character'
import { CharacterNotFoundException } from '#domainModels/character/character_not_found.exception'
import { inject } from '@adonisjs/core'
import { UpdateCharacterUseCase } from '#domainPorts/in/character/update_character.use_case'

@inject()
export class UpdateCharacterService implements UpdateCharacterUseCase {
  constructor(readonly charactersRepository: ICharactersRepository) {}

  async update(characterId: Id, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
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
