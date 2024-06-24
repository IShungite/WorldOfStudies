import { Id } from '#shared/id/domain/models/id'
import QuizInstanceEntity from '#quiz/infrastructure/entities/quiz_instance'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { QuizStorageMapper } from '#quiz/infrastructure/mappers/quiz_storage.mapper'

export class QuizInstanceStorageMapper {
  static fromLucid(quizInstanceEntity: QuizInstanceEntity): QuizInstance {
    return new QuizInstance({
      id: new Id(quizInstanceEntity.id.toString()),
      quiz: QuizStorageMapper.fromLucid(quizInstanceEntity.quiz),
      characterId: new Id(quizInstanceEntity.characterId.toString()),
    })
  }
}
