import { QuestionApiMapper } from '#quiz/infrastructure/mappers/question_api.mapper'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { PaginatedResponse } from '#shared/pagination/infrastructure/types/paginated_response'
import { Quiz } from '#quiz/domain/models/quiz/quiz'

export class QuizApiMapper {
  static toResponse(quiz: Quiz) {
    return {
      id: quiz.id.toString(),
      name: quiz.name,
      questions: quiz.questions.map((question) => QuestionApiMapper.toResponse(question)),
    }
  }

  static toPaginatedResponse(
    paginatedQuizzes: PaginatedData<Quiz>
  ): PaginatedResponse<ReturnType<typeof QuizApiMapper.toResponse>> {
    return {
      results: paginatedQuizzes.results.map((quiz) => QuizApiMapper.toResponse(quiz)),
      totalResults: paginatedQuizzes.totalResults,
      perPage: paginatedQuizzes.perPage,
      currentPage: paginatedQuizzes.currentPage,
      firstPage: paginatedQuizzes.firstPage,
      lastPage: paginatedQuizzes.lastPage,
    }
  }
}
