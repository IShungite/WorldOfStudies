import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id'
import { GetQuizUseCase } from '#domainPorts/in/quiz/get_quiz.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetQuizService implements GetQuizUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async get(quizId: Id): Promise<Quiz | null> {
    return this.quizzesRepository.getById(quizId)
  }
}
