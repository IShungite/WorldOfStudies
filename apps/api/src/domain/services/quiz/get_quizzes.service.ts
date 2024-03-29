import { Quiz } from '#domain/models/quiz/quiz'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { inject } from '@adonisjs/core'
import { PaginatedData } from '#domain/models/pagination/paginated_data'
import { PaginationRequest } from '#domain/models/pagination/pagination_request'

@inject()
export class GetQuizzesService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(pagination: PaginationRequest): Promise<PaginatedData<Quiz>> {
    return this.quizzesRepository.getAll(pagination)
  }
}
