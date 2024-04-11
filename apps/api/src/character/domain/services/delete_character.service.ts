import { inject } from '@adonisjs/core'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Id } from '#shared/id/domain/models/id'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'
import { User } from '#user/domain/models/user'

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
