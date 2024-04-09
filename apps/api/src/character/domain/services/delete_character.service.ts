import { CharacterNotFoundException } from '../models/character_not_found.exception.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { ICharactersRepository } from '../contracts/repositories/characters.repository.js'
import { inject } from '@adonisjs/core'
import { User } from '../../../user/domain/models/user.js'
import { UnauthorizedException } from '../../../shared/exceptions/unauthorized.exception'

@inject()
export class DeleteCharacterService {
  constructor(private readonly characterRepository: ICharactersRepository) {}

  private async validate(characterId: Id, user: User) {
    const character = await this.characterRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    if (!character.userId.equals(user.id)) {
      throw new UnauthorizedException()
    }
  }
  async execute(characterId: Id, user: User): Promise<void> {
    await this.validate(characterId, user)

    await this.characterRepository.deleteById(characterId)
  }
}
