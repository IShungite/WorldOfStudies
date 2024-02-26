import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id'

export abstract class IQuizzesRepository {
  abstract create(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(): Promise<Quiz[]>
  abstract deleteById(quizId: Id): Promise<void>
}
