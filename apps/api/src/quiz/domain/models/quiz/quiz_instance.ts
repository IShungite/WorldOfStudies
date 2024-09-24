import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'
import { QuizStat } from '@world-of-studies/api-types'

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

  getStats(): QuizStat {
    return {
      name: this.quiz.name,
      score: (20 * this.getTotalUserPoints()) / this.getMaxPoints(),
      maxScore: 20,
      date:
        this.userAnswers
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .at(-1)
          ?.createdAt.toString() ?? new Date().toString(),
    }
  }
}
