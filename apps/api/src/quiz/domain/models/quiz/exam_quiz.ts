import { Question } from '#quiz/domain/models/quiz/question'
import { CreateBaseQuizDto, Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { Id } from '#shared/id/domain/models/id'

export type CreateExamQuizDto = CreateBaseQuizDto & {
  startAt: Date
  endAt: Date
  type: QuizType.EXAM
}

export class ExamQuiz extends Quiz {
  readonly startAt: Date
  readonly endAt: Date

  constructor({
    id,
    name,
    questions,
    subjectId,
    startAt,
    endAt,
  }: {
    id?: Id
    name: string
    questions: Question[]
    subjectId: Id
    startAt: Date
    endAt: Date
  }) {
    super({
      id,
      name,
      questions,
      subjectId,
    })
    this.startAt = startAt
    this.endAt = endAt
  }
}
