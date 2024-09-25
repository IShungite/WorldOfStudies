import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character } from '#character/domain/models/character'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { Id } from '#shared/id/domain/models/id'
import { User } from '#user/domain/models/user'
import { inject } from '@adonisjs/core'

@inject()
export class GetCharacterByIdService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(characterId: Id, user: User): Promise<Character> {
    const character = await this.charactersRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    return character
  }
}
