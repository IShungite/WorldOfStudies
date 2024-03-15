import { Id } from '#domainModels/id/id'

export interface DeleteQuizUseCase {
  delete(quizId: Id): Promise<void>
}
