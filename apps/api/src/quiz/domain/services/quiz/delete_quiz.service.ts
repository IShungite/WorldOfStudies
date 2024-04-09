import { Id } from '../../../../shared/id/domain/models/id.js'
import { QuizNotFoundException } from '../../models/quiz/quiz_not_found.exception.js'
import { IQuizzesRepository } from '../../contracts/quizzes.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(quizId: Id): Promise<void> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    await this.quizzesRepository.deleteById(quizId)
  }
}
