import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import QuizInstanceEntity from '#quiz/infrastructure/entities/quiz_instance'
import { Id } from '#shared/id/domain/models/id'
import { QuizInstanceStorageMapper } from '#quiz/infrastructure/mappers/quiz_instance_storage.mapper'
import testUtils from '@adonisjs/core/services/test_utils'

export class LucidQuizzesInstanceRepository implements IQuizzesInstanceRepository {
  async save(quizInstance: QuizInstance): Promise<QuizInstance> {
    const quizInstanceId = Number.parseInt(quizInstance.id.toString(), 10)
    await QuizInstanceEntity.updateOrCreate(
      {
        id: quizInstanceId,
      },
      {
        id: quizInstanceId,
        quizId: Number.parseInt(quizInstance.quiz.id.toString(), 10),
        characterId: Number.parseInt(quizInstance.characterId.toString(), 10),
      }
    )

    return quizInstance
  }

  async getByQuizIdAndCharacterId(quizId: Id, characterId: Id): Promise<QuizInstance | null> {
    const quizInstance = await QuizInstanceEntity.query()
      .preload('quiz', (q) => q.preload('questions'))
      .where('quizId', quizId.toString())
      .where('characterId', characterId.toString())
      .first()

    return quizInstance ? QuizInstanceStorageMapper.fromLucid(quizInstance) : null
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
