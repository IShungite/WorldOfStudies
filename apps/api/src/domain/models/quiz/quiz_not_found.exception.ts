import { Id } from '#domain/models/id/id'

export class QuizNotFoundException extends Error {
  constructor(quizId: Id) {
    super(`Quiz with id ${quizId} not found`)
  }
}
