import { CharacterNotFoundException } from '#domain/models/character/character_not_found.exception'
import { Id } from '#domain/models/id/id'
import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { inject } from '@adonisjs/core'
import { User } from '#domain/models/user/user'
import { UnauthorizedException } from '#domain/models/exceptions/unauthorized.exception'

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
