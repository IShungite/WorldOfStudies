import { Quiz } from '#domainModels/quiz/quiz'

export interface GetQuizzesUseCase {
  getAll(): Promise<Quiz[]>
}
