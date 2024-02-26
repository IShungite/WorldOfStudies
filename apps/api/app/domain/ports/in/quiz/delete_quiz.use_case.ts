import { Id } from '#domainModels/id'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'

export interface DeleteQuizUseCase {
  delete(quizId: Id): Promise<void>
}
