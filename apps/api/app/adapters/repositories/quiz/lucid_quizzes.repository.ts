import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import testUtils from '@adonisjs/core/services/test_utils'
import { QuizMapper } from '#mappers/quiz.mapper'
import QuizEntity from '#models/quiz'
import { QuestionQcm, QuestionTextHole } from '#domainModels/quiz/question'
import QuestionEntity from '#models/question'

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

    return quiz ? QuizMapper.fromAdonis(quiz) : null
  }

  async getAll(): Promise<Quiz[]> {
    const quizzes = await QuizEntity.query().preload('questions')

    return quizzes.map((quiz) => QuizMapper.fromAdonis(quiz))
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