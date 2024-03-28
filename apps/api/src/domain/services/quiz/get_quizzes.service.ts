import { Quiz } from '#domain/models/quiz/quiz'
import { IQuizzesRepository } from '#domain/ports/out/quizzes.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetQuizzesService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(): Promise<Quiz[]> {
    return this.quizzesRepository.getAll()
  }
}
