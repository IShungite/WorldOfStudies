import { Quiz } from '../../domain/models/quiz/quiz.js'
import QuizEntity from '../entities/quiz.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { QuestionStorageMapper } from './question_storage.mapper.js'

export class QuizStorageMapper {
  static fromLucid(quizEntity: QuizEntity): Quiz {
    return new Quiz({
      id: new Id(quizEntity.id.toString()),
      name: quizEntity.name,
      questions: quizEntity.questions.map((question) => QuestionStorageMapper.fromLucid(question)),
    })
  }
}
