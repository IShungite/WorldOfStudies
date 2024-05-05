import { Id } from '#shared/id/domain/models/id'
import QuizGameEntity from '#quiz/infrastructure/entities/quiz_game'
import { QuizGame } from '#quiz/domain/models/quiz/quiz_game'
import { QuizStorageMapper } from '#quiz/infrastructure/mappers/quiz_storage.mapper'

export class QuizGameStorageMapper {
  static fromLucid(quizGameEntity: QuizGameEntity): QuizGame {
    return new QuizGame({
      id: new Id(quizGameEntity.id.toString()),
      quiz: QuizStorageMapper.fromLucid(quizGameEntity.quiz),
      characterId: new Id(quizGameEntity.characterId.toString()),
    })
  }
}
