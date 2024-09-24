import testUtils from '@adonisjs/core/services/test_utils'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { Question, QuestionQcm, QuestionTextHole } from '#quiz/domain/models/quiz/question'
import { Id } from '#shared/id/domain/models/id'
import { QuizStorageMapper } from '#quiz/infrastructure/mappers/quiz_storage.mapper'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { PaginatedData } from '#shared/pagination/domain/models/paginated_data'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import QuizEntity from '#quiz/infrastructure/entities/quiz'
import QuestionEntity from '#quiz/infrastructure/entities/question'
import { ExamQuiz } from '#quiz/domain/models/quiz/exam_quiz'
import { DateTime } from 'luxon'
import QuizInstance from '#quiz/infrastructure/entities/quiz_instance'

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
        subjectId: Number.parseInt(quiz.subjectId.toString(), 10),
        type: quiz instanceof ExamQuiz ? QuizType.EXAM : QuizType.PRACTICE,
        startAt: quiz instanceof ExamQuiz ? DateTime.fromJSDate(quiz.startAt) : null,
        endAt: quiz instanceof ExamQuiz ? DateTime.fromJSDate(quiz.endAt) : null,
      }
    )

    await Promise.all(
      quiz.questions.map((question) => this.createOrUpdateQuestion(quiz.id, question))
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

  async getAll(
    quizType: QuizType | 'all',
    pagination: PaginationRequest
  ): Promise<PaginatedData<Quiz>> {
    const query = QuizEntity.query().preload('questions').orderBy('id', 'asc')

    if (quizType !== 'all') {
      query.where('type', quizType)
    }

    const quizzes = await query.paginate(pagination.page, pagination.perPage)
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

  async getAllWithLastInstanceByCharacterId(
    characterId: Id,
    pagination: PaginationRequest
  ): Promise<
    PaginatedData<{
      quiz: Quiz
      last_quiz_instance_status: string
    }>
  > {
    const quizzes = await QuizEntity.query()
      .select('quizzes.*', 'qi.status as last_quiz_instance_status')
      .preload('questions')
      .joinRaw(
        `
        LEFT JOIN (
          SELECT
              quiz_id,
              status,
              created_at
          FROM
              quiz_instances
          WHERE
              character_id = ${characterId.toString()}
          ORDER BY
              created_at DESC
          LIMIT 1
        ) qi ON quizzes.id = qi.quiz_id
      `
      )
      .orderBy('qi.created_at', 'desc')
      .paginate(pagination.page, pagination.perPage)

    const { data, meta } = quizzes.toJSON()

    return new PaginatedData({
      results: (data as QuizEntity[]).map((res) => {
        const quiz = QuizStorageMapper.fromLucid(res)
        return {
          quiz,
          last_quiz_instance_status: res.$extras.last_quiz_instance_status,
        }
      }),
      totalResults: meta.total,
      perPage: meta.perPage,
      currentPage: meta.currentPage,
      firstPage: meta.firstPage,
      lastPage: meta.lastPage,
    })
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }

  private async createOrUpdateQuestion(quizId: Id, question: Question): Promise<void> {
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

    await QuestionEntity.updateOrCreate(
      { id: Number.parseInt(question.id.toString(), 10) },
      {
        id: Number.parseInt(question.id.toString(), 10),
        type: question.type,
        points: question.points,
        extra: JSON.stringify(extra),
        quizId: Number.parseInt(quizId.toString(), 10),
      }
    )
  }
}
