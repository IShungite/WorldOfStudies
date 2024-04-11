import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { Id } from '#shared/id/domain/models/id'

export class InMemoryQuizzesRepository implements IQuizzesRepository {
  private quizzes: Record<string, Quiz> = {}

  async save(quiz: Quiz): Promise<Quiz> {
    this.quizzes[quiz.id.toString()] = quiz
    return quiz
  }

  async getById(quizId: Id): Promise<Quiz | null> {
    return this.quizzes[quizId.toString()] ?? null
  }

  async getAll(): Promise<PaginatedData<Quiz>> {
    return new PaginatedData({
      results: Object.values(this.quizzes),
      currentPage: 1,
      perPage: 10,
      totalResults: Object.values(this.quizzes).length,
      firstPage: 1,
      lastPage: 1,
    })
  }

  async deleteById(quizId: Id): Promise<void> {
    delete this.quizzes[quizId.toString()]
  }

  async empty(): Promise<void> {
    this.quizzes = {}
  }
}
