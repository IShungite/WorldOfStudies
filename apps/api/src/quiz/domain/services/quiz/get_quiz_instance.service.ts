import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstanceNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_instance_not_found.exception'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { Id } from '#shared/id/domain/models/id'
import { inject } from '@adonisjs/core'

@inject()
export class GetQuizInstanceService {
  constructor(
    private readonly quizzesInstanceRepository: IQuizzesInstanceRepository,
    private readonly charactersRepository: ICharactersRepository
  ) {}

  async execute(quizInstanceId: Id, userId: Id): Promise<QuizInstance> {
    const quizInstance = await this.validate(quizInstanceId, userId)

    return quizInstance
  }

  private async validate(quizInstanceId: Id, userId: Id) {
    const quizInstance = await this.quizzesInstanceRepository.getById(quizInstanceId)
    if (!quizInstance) {
      throw new QuizInstanceNotFoundException(quizInstanceId)
    }

    const characters = await this.charactersRepository.getAllByUserId(userId)
    if (!characters.some((character) => character.id.equals(quizInstance.characterId))) {
      throw new QuizInstanceNotFoundException(quizInstanceId)
    }

    return quizInstance
  }
}
