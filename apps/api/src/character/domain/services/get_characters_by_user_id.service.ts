import { Character } from '../models/character.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { ICharactersRepository } from '../contracts/repositories/characters.repository.js'
import { inject } from '@adonisjs/core'
import { User } from '../../../user/domain/models/user.js'
import { UnauthorizedException } from '../../../shared/exceptions/unauthorized.exception'

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
