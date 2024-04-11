import { Id } from '#shared/id/domain/models/id'
import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { ClearableRepository } from '#shared/storage/clearable_repository'

export abstract class IQuizzesRepository implements ClearableRepository {
  abstract save(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(pagination: PaginationRequest): Promise<PaginatedData<Quiz>>
  abstract deleteById(quizId: Id): Promise<void>
  abstract empty(): Promise<void>
}
