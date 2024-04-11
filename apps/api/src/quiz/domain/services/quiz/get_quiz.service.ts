import { inject } from '@adonisjs/core'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { Id } from '#shared/id/domain/models/id'
import { QuizNotFoundException } from '#quiz/domain/models/quiz/quiz_not_found.exception'
import { Quiz } from '#quiz/domain/models/quiz/quiz'

@inject()
export class GetQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(quizId: Id): Promise<Quiz> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    return quiz
  }
}
