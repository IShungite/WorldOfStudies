import { Quiz } from '../../models/quiz/quiz.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { IQuizzesRepository } from '../../contracts/quizzes.repository.js'
import { inject } from '@adonisjs/core'
import { QuizNotFoundException } from '../../models/quiz/quiz_not_found.exception.js'

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
