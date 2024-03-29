import { Quiz } from '#domain/models/quiz/quiz'
import { Id } from '#domain/models/id/id'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import testUtils from '@adonisjs/core/services/test_utils'
import { QuizMapper } from '#infrastructure/mappers/quiz.mapper'
import QuizEntity from '#infrastructure/entities/quiz'
import { QuestionQcm, QuestionTextHole } from '#domain/models/quiz/question'
import QuestionEntity from '#infrastructure/entities/question'
import { Pagination } from '#domain/types/pagination'
import { PaginatedData } from '#domain/models/pagination/paginated_data'

export class LucidQuizzesRepository implements IQuizzesRepository {
  async save(quiz: Quiz): Promise<Quiz> {
    const quizId = Number.parseInt(quiz.id.toString(), 10)
    await QuizEntity.updateOrCreate(
      {
        id: quizId,
      },
      {
        id: quizId,
        name: quiz.name,
      }
    )

    await Promise.all(
      quiz.questions.map((question) => {
        let extra: Record<string, unknown> = {}
        if (question instanceof QuestionQcm) {
          extra = {
            choices: question.choices.map((choice) => ({
              id: Number.parseInt(choice.id.toString(), 10),
              label: choice.label,
              isCorrect: choice.isCorrect,
            })),
          }
        } else if (question instanceof QuestionTextHole) {
          extra = {
            text: question.text,
            answers: question.answers,
          }
        }

        return QuestionEntity.updateOrCreate(
          { id: Number.parseInt(question.id.toString(), 10) },
          {
            id: Number.parseInt(question.id.toString(), 10),
            type: question.type,
            points: question.points,
            extra: JSON.stringify(extra),
            quizId: quizId,
          }
        )
      })
    )

    return quiz
  }

  async getById(quizId: Id): Promise<Quiz | null> {
    const quiz = await QuizEntity.query()
      .preload('questions')
      .where('id', quizId.toString())
      .first()

    return quiz ? QuizMapper.fromLucid(quiz) : null
  }

  async getAll(pagination: Pagination): Promise<PaginatedData<Quiz>> {
    const quizzes = await QuizEntity.query()
      .preload('questions')
      .paginate(pagination.page, pagination.limit)

    const { data, meta } = quizzes.toJSON()

    return new PaginatedData({
      results: (data as QuizEntity[]).map(QuizMapper.fromLucid),
      totalResults: meta.totalResults,
      currentPage: meta.currentPage,
      totalPages: meta.totalPages,
      lastPage: meta.lastPage,
    })
  }

  async deleteById(quizId: Id): Promise<void> {
    await QuizEntity.query().where('id', quizId.toString()).delete()
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
