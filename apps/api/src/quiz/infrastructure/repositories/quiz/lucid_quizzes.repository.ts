import { Quiz } from '../../../domain/models/quiz/quiz.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { IQuizzesRepository } from '../../../domain/contracts/quizzes.repository.js'
import testUtils from '@adonisjs/core/services/test_utils'
import QuizEntity from '../../entities/quiz.js'
import { QuestionQcm, QuestionTextHole } from '../../../domain/models/quiz/question.js'
import QuestionEntity from '../../entities/question.js'
import { PaginatedData } from '../../../../shared/pagination/domain/models/paginated_data.js'
import { PaginationRequest } from '../../../../shared/pagination/domain/models/pagination_request.js'
import { QuizStorageMapper } from '../../mappers/quiz_storage.mapper.js'

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

    return quiz ? QuizStorageMapper.fromLucid(quiz) : null
  }

  async getAll(pagination: PaginationRequest): Promise<PaginatedData<Quiz>> {
    const quizzes = await QuizEntity.query()
      .preload('questions')
      .orderBy('id', 'asc')
      .paginate(pagination.page, pagination.perPage)

    const { data, meta } = quizzes.toJSON()

    return new PaginatedData({
      results: (data as QuizEntity[]).map(QuizStorageMapper.fromLucid),
      totalResults: meta.total,
      perPage: meta.perPage,
      currentPage: meta.currentPage,
      firstPage: meta.firstPage,
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
