import { Character } from '#domain/models/character/character'
import { Id } from '#domain/models/id/id'
import { ICharactersRepository } from '#domain/ports/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetCharactersByUserIdService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(userId: Id): Promise<Character[]> {
    return this.charactersRepository.getAllByUserId(userId)
  }
}
