import { Quiz } from '../../domain/models/quiz/quiz.js'
import { QuestionMapper } from './question.mapper.js'
import QuizEntity from '../entities/quiz.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { PaginatedData } from '../../../shared/pagination/domain/models/paginated_data.js'
import { PaginatedResponse } from '../../../shared/pagination/infrastructure/types/paginated_response.js'

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
