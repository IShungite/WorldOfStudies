import { inject } from '@adonisjs/core'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { Quiz } from '#quiz/domain/models/quiz/quiz'

@inject()
export class GetQuizzesService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(pagination: PaginationRequest): Promise<PaginatedData<Quiz>> {
    return this.quizzesRepository.getAll(pagination)
  }
}
