import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { Id } from '#shared/id/domain/models/id'

export class QuizGame {
  readonly id: Id
  readonly quiz: Quiz
  readonly characterId: Id

  constructor({ id, quiz, characterId }: { id?: Id; quiz: Quiz; characterId: Id }) {
    this.id = id || Id.factory()
    this.quiz = quiz
    this.characterId = characterId
  }
}
