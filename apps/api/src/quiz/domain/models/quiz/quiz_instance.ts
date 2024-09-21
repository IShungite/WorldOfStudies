import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'

export class QuizInstance {
  readonly id: Id
  readonly quiz: Quiz
  readonly characterId: Id
  readonly userAnswers: UserAnswer[]

  constructor({
    id,
    quiz,
    characterId,
    userAnswers,
  }: {
    id?: Id
    quiz: Quiz
    characterId: Id
    userAnswers: UserAnswer[]
  }) {
    this.id = id || Id.factory()
    this.quiz = quiz
    this.characterId = characterId
    this.userAnswers = userAnswers
  }

  getTotalPoints(): number {
    return this.quiz.getTotalPoints(this.userAnswers)
  }

  getMaxPoints(): number {
    return this.quiz.getMaxPoints()
  }
}
