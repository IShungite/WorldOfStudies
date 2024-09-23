import { Id } from '#shared/id/domain/models/id'

export class QuizInstanceNotFoundException extends Error {
  constructor(quizInstanceId: Id) {
    super(`Quiz instance with id ${quizInstanceId} not found`)
  }
}
