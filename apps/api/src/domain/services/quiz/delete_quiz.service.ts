import { Id } from '#domain/models/id/id'
import { QuizNotFoundException } from '#domain/models/quiz/quiz_not_found.exception'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
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
