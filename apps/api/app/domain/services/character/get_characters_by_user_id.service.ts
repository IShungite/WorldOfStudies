import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id'
import { GetCharactersByUserIdUseCase } from '#domainPorts/in/character/get_characters_by_user_id.use_case'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetCharactersByUserIdService implements GetCharactersByUserIdUseCase {
  constructor(private readonly charactersRepository: ICharactersRepository) {}

  async get(userId: Id): Promise<Character[]> {
    return this.charactersRepository.getAllByUserId(userId)
  }
}
