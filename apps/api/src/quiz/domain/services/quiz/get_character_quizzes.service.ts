import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { Id } from '#shared/id/domain/models/id'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { inject } from '@adonisjs/core'

@inject()
export default class GetCharacterQuizzesService {
  constructor(
    private readonly quizzesRepository: IQuizzesRepository,
    private readonly charactersRepository: ICharactersRepository
  ) {}

  async execute(characterId: Id, pagination: PaginationRequest, userId: Id) {
    await this.validate(characterId, userId)
    const quizzes = await this.quizzesRepository.getAllWithLastInstanceByCharacterId(
      characterId,
      pagination
    )

    return quizzes
  }

  private async validate(characterId: Id, userId: Id) {
    const character = await this.charactersRepository.getById(characterId)
    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    if (!character.userId.equals(userId)) {
      throw new CharacterNotFoundException(characterId)
    }
  }
}
