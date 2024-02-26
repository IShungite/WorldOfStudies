import { Quiz } from '#domainModels/quiz/quiz'
import { GetQuizzesUseCase } from '#domainPorts/in/quiz/get_quizzes.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetQuizzesService implements GetQuizzesUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async getAll(): Promise<Quiz[]> {
    return this.quizzesRepository.getAll()
  }
}
