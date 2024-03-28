import { CharacterNotFoundException } from '#domain/models/character/character_not_found.exception'
import { Id } from '#domain/models/id/id'
import { ICharactersRepository } from '#domain/ports/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteCharacterService {
  constructor(private readonly characterRepository: ICharactersRepository) {}

  async execute(characterId: Id): Promise<void> {
    const character = await this.characterRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    await this.characterRepository.deleteById(characterId)
  }
}
