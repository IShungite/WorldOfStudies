import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'
import { GetQuizUseCase } from '#domainPorts/in/quiz/get_quiz.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { inject } from '@adonisjs/core'
import { QuizNotFoundException } from '#domainModels/quiz/quiz_not_found.exception'

@inject()
export class GetQuizService implements GetQuizUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async get(quizId: Id): Promise<Quiz> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    return quiz
  }
}
