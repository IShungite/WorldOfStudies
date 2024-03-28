import { Quiz } from '#domain/models/quiz/quiz'
import { Id } from '#domain/models/id/id'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { inject } from '@adonisjs/core'
import { QuizNotFoundException } from '#domain/models/quiz/quiz_not_found.exception'

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
