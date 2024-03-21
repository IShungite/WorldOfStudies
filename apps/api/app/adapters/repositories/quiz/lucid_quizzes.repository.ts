import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import testUtils from '@adonisjs/core/services/test_utils'
import SchoolEntity from '#models/school'
import { QuizMapper } from '#mappers/quiz.mapper'
import QuizEntity from '#models/quiz'

export class LucidQuizzesRepository implements IQuizzesRepository {
  async save(quiz: Quiz): Promise<Quiz> {
    return quiz
  }

  async getById(quizId: Id): Promise<Quiz | null> {
    const quiz = await QuizEntity.query()
      .preload('questions')
      .where('id', quizId.toString())
      .first()

    return quiz ? QuizMapper.fromAdonis(quiz) : null
  }

  async getAll(): Promise<Quiz[]> {
    const quizzes = await QuizEntity.query().preload('questions')

    return quizzes.map((quiz) => QuizMapper.fromAdonis(quiz))
  }

  async deleteById(quizId: Id): Promise<void> {
    await SchoolEntity.query().where('id', quizId.toString()).delete()
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
