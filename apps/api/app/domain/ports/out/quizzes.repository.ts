import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'

export abstract class IQuizzesRepository {
  abstract save(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(): Promise<Quiz[]>
  abstract deleteById(quizId: Id): Promise<void>
  abstract empty(): Promise<void>
}
