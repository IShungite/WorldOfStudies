import { IQuizzesGameRepository } from '#quiz/domain/contracts/quizzes_game.repository'
import { QuizGame } from '#quiz/domain/models/quiz/quiz_game'
import QuizGameEntity from '#quiz/infrastructure/entities/quiz_game'
import { Id } from '#shared/id/domain/models/id'
import { QuizGameStorageMapper } from '#quiz/infrastructure/mappers/quiz_game_storage.mapper'
import testUtils from '@adonisjs/core/services/test_utils'

export class LucidQuizzesGameRepository implements IQuizzesGameRepository {
  async save(quizGame: QuizGame): Promise<QuizGame> {
    const quizGameId = Number.parseInt(quizGame.quiz.id.toString(), 10)
    await QuizGameEntity.updateOrCreate(
      {
        id: quizGameId,
      },
      {
        id: quizGameId,
        quizId: Number.parseInt(quizGame.quiz.id.toString(), 10),
        characterId: Number.parseInt(quizGame.characterId.toString(), 10),
      }
    )

    return quizGame
  }

  async getByQuizIdAndCharacterId(quizId: Id, characterId: Id): Promise<QuizGame | null> {
    const quizGame = await QuizGameEntity.query()
      .preload('quiz', (q) => q.preload('questions'))
      .where('quizId', quizId.toString())
      .where('characterId', characterId.toString())
      .first()

    return quizGame ? QuizGameStorageMapper.fromLucid(quizGame) : null
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
