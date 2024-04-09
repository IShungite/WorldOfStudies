import { Quiz } from '../../models/quiz/quiz.js'
import { IQuizzesRepository } from '../../contracts/quizzes.repository.js'
import { inject } from '@adonisjs/core'
import { PaginatedData } from '../../../../shared/pagination/domain/models/paginated_data.js'
import { PaginationRequest } from '../../../../shared/pagination/domain/models/pagination_request.js'

@inject()
export class GetQuizzesService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(pagination: PaginationRequest): Promise<PaginatedData<Quiz>> {
    return this.quizzesRepository.getAll(pagination)
  }
}
