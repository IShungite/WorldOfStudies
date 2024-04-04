import { Quiz } from '#domain/models/quiz/quiz'
import { QuestionMapper } from '#infrastructure/mappers/question.mapper'
import QuizEntity from '#infrastructure/entities/quiz'
import { Id } from '#domain/models/id/id'
import { PaginatedData } from '#domain/models/pagination/paginated_data'
import { PaginatedResponse } from '#infrastructure/types/paginated_response'

export class QuizMapper {
  static toResponse(quiz: Quiz) {
    return {
      id: quiz.id.toString(),
      name: quiz.name,
      questions: quiz.questions.map((question) => QuestionMapper.toResponse(question)),
    }
  }

  static toPaginatedResponse(
    paginatedQuizzes: PaginatedData<Quiz>
  ): PaginatedResponse<ReturnType<typeof QuizMapper.toResponse>> {
    return {
      results: paginatedQuizzes.results.map((quiz) => QuizMapper.toResponse(quiz)),
      totalResults: paginatedQuizzes.totalResults,
      perPage: paginatedQuizzes.perPage,
      currentPage: paginatedQuizzes.currentPage,
      firstPage: paginatedQuizzes.firstPage,
      lastPage: paginatedQuizzes.lastPage,
    }
  }

  static fromLucid(quizEntity: QuizEntity): Quiz {
    return new Quiz({
      id: new Id(quizEntity.id.toString()),
      name: quizEntity.name,
      questions: quizEntity.questions.map((question) => QuestionMapper.fromLucid(question)),
    })
  }
}
