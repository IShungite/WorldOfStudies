import { Id } from '#domainModels/id/id'

export class QuizNotFoundException extends Error {
  constructor(quizId: Id) {
    super(`Quiz with id ${quizId} not found`)
  }
}
