import { Id } from '../../../../shared/id/domain/models/id.js'

export class QuizNotFoundException extends Error {
  constructor(quizId: Id) {
    super(`Quiz with id ${quizId} not found`)
  }
}
