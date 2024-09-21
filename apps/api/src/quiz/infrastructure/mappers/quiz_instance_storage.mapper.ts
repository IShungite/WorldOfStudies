import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import QuizInstanceEntity from '#quiz/infrastructure/entities/quiz_instance'
import { QuizStorageMapper } from '#quiz/infrastructure/mappers/quiz_storage.mapper'
import { UserAnswerStorageMapper } from '#quiz/infrastructure/mappers/user_answer_storage.mapper'
import { Id } from '#shared/id/domain/models/id'

export class QuizInstanceStorageMapper {
  static fromLucid(quizInstanceEntity: QuizInstanceEntity): QuizInstance {
    return new QuizInstance({
      id: new Id(quizInstanceEntity.id.toString()),
      quiz: QuizStorageMapper.fromLucid(quizInstanceEntity.quiz),
      characterId: new Id(quizInstanceEntity.characterId.toString()),
      userAnswers: quizInstanceEntity.userAnswers.map((userAnswer) =>
        UserAnswerStorageMapper.fromLucid(userAnswer, new Id(quizInstanceEntity.id.toString()))
      ),
    })
  }
}
