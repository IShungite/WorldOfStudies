import { Character } from '#domainModels/character/character'
import { Id } from '#domainModels/id/id'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetCharactersByUserIdService {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async execute(userId: Id): Promise<Character[]> {
    return this.charactersRepository.getAllByUserId(userId)
  }
}
