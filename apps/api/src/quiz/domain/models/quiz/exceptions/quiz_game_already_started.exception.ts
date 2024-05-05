import { Id } from '#shared/id/domain/models/id'

export class QuizGameAlreadyStartedException extends Error {
  constructor(quizId: Id) {
    super(`Quiz game already started for quiz ${quizId}`)
  }
}
