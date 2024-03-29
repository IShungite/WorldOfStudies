import { Character } from '#domain/models/character/character'
import { Id } from '#domain/models/id/id'
import { ICharactersRepository } from '#domain/contracts/repositories/characters.repository'
import { inject } from '@adonisjs/core'
import { User } from '#domain/models/user/user'
import { UnauthorizedException } from '#domain/models/exceptions/unauthorized.exception'

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
