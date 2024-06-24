import { Id } from '#shared/id/domain/models/id'

export class QuizInstanceAlreadyExists extends Error {
  constructor(quizId: Id) {
    super(`The Quiz ${quizId} is already started`)
  }
}
