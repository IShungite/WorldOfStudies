import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'

export enum QuizInstanceStatus {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export type UpdateQuizInstanceDto = {
  status: QuizInstanceStatus
}

export class QuizInstance {
  readonly id: Id
  readonly quiz: Quiz
  readonly characterId: Id
  readonly userAnswers: UserAnswer[]
  readonly status: QuizInstanceStatus

  constructor({
    id,
    quiz,
    characterId,
    userAnswers,
    status,
  }: {
    id?: Id
    quiz: Quiz
    characterId: Id
    userAnswers: UserAnswer[]
    status: QuizInstanceStatus
  }) {
    this.id = id || Id.factory()
    this.quiz = quiz
    this.characterId = characterId
    this.userAnswers = userAnswers
    this.status = status
  }

  getTotalUserPoints(): number {
    return this.quiz.getTotalUserPoints(this.userAnswers)
  }

  getMaxPoints(): number {
    return this.quiz.getMaxPoints()
  }
}
