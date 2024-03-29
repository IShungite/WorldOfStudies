import { Quiz } from '#domain/models/quiz/quiz'
import { Id } from '#domain/models/id/id'
import { ClearableRepository } from '#infrastructure/repositories/clearable_repository'
import { PaginatedData } from '#domain/models/pagination/paginated_data'
import { PaginationRequest } from '#domain/models/pagination/pagination_request'

export abstract class IQuizzesRepository implements ClearableRepository {
  abstract save(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(pagination: PaginationRequest): Promise<PaginatedData<Quiz>>
  abstract deleteById(quizId: Id): Promise<void>
  abstract empty(): Promise<void>
}
