import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'

export interface GetQuizUseCase {
  get(quizId: Id): Promise<Quiz | null>
}
