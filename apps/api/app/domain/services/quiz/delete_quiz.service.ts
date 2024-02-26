import { Id } from '#domainModels/id'
import { DeleteQuizUseCase } from '#domainPorts/in/quiz/delete_quiz.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteQuizService implements DeleteQuizUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async delete(quizId: Id): Promise<void> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new Error('Quiz not found')
    }

    await this.quizzesRepository.deleteById(quizId)
  }
}
