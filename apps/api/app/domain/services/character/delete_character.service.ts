import { CharacterNotFoundException } from '#domainModels/character/character_not_found.exception'
import { Id } from '#domainModels/id/id'
import { DeleteCharacterUseCase } from '#domainPorts/in/character/delete_character.use_case'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteCharacterService implements DeleteCharacterUseCase {
  constructor(private readonly characterRepository: ICharactersRepository) {}

  async delete(characterId: Id): Promise<void> {
    const character = await this.characterRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    await this.characterRepository.deleteById(characterId)
  }
}
