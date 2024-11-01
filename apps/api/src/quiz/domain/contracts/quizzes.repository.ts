import { Id } from '#shared/id/domain/models/id'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { ClearableRepository } from '#shared/infra/storage/clearable_repository'

export abstract class IQuizzesRepository implements ClearableRepository {
  abstract save(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: Id): Promise<Quiz | null>
  abstract getAll(
    quizType: QuizType | 'all',
    pagination: PaginationRequest
  ): Promise<PaginatedData<Quiz>>
  abstract getAllWithLastInstanceByCharacterId(
    characterId: Id,
    pagination: PaginationRequest
  ): Promise<
    PaginatedData<{
      quiz: Quiz
      last_quiz_instance_status: string
    }>
  >
  abstract deleteById(quizId: Id): Promise<void>
  abstract empty(): Promise<void>
}
