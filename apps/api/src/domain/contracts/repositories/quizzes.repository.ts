import { Quiz } from '#domain/models/quiz/quiz'
import { Id } from '#domain/models/id/id'
import { ClearableRepository } from '#infrastructure/repositories/clearable_repository'

export abstract class IQuizzesRepository implements ClearableRepository {
  abstract save(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(): Promise<Quiz[]>
  abstract deleteById(quizId: Id): Promise<void>
  abstract empty(): Promise<void>
}
