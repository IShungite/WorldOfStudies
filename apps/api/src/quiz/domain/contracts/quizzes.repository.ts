import { Quiz } from '../models/quiz/quiz.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { ClearableRepository } from '../../../shared/clearable_repository.js'
import { PaginatedData } from '../../../shared/pagination/domain/models/paginated_data.js'
import { PaginationRequest } from '../../../shared/pagination/domain/models/pagination_request.js'

export abstract class IQuizzesRepository implements ClearableRepository {
  abstract save(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(pagination: PaginationRequest): Promise<PaginatedData<Quiz>>
  abstract deleteById(quizId: Id): Promise<void>
  abstract empty(): Promise<void>
}
