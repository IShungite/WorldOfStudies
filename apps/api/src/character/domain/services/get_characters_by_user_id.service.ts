import { inject } from '@adonisjs/core'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Id } from '#shared/id/domain/models/id'
import { UnauthorizedException } from '#shared/domain/exceptions/unauthorized.exception'
import { User } from '#user/domain/models/user'
import { Character } from '#character/domain/models/character'

@inject()
export class GetCharactersByUserIdService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  private validate(userId: Id, user: User) {
    if (!user.id.equals(userId)) {
      throw new UnauthorizedException()
    }
  }

  async execute(userId: Id, user: User): Promise<Character[]> {
    this.validate(userId, user)

    return this.charactersRepository.getAllByUserId(userId)
  }
}
