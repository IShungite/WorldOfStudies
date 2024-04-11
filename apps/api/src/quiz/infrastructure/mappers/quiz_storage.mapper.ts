import { Id } from '#shared/id/domain/models/id'
import { QuestionStorageMapper } from '#quiz/infrastructure/mappers/question_storage.mapper'
import { Quiz } from '#quiz/domain/models/quiz/quiz'
import QuizEntity from '#quiz/infrastructure/entities/quiz'

export class QuizStorageMapper {
  static fromLucid(quizEntity: QuizEntity): Quiz {
    return new Quiz({
      id: new Id(quizEntity.id.toString()),
      name: quizEntity.name,
      questions: quizEntity.questions.map((question) => QuestionStorageMapper.fromLucid(question)),
    })
  }
}
