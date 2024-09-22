import { CreateQuestionDto, Question } from '#quiz/domain/models/quiz/question'
import { Id } from '#shared/id/domain/models/id'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'

export enum QuizType {
  EXAM = 'exam',
  PRACTICE = 'practice',
}

export type CreateQuizDto = {
  name: string
  subjectId: Id
  questions: CreateQuestionDto[]
  type: QuizType
}

export type UpdateQuizDto = {
  name?: string
  subjectId?: Id
  questions?: CreateQuestionDto[]
}

type QuizProps = { id?: Id; name: string; questions: Question[]; subjectId: Id }

export class Quiz {
  readonly id: Id
  readonly name: string
  readonly questions: Question[]
  readonly subjectId: Id

  constructor({ id, name, questions, subjectId }: QuizProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.questions = questions
    this.subjectId = subjectId
  }

  getTotalUserPoints(userAnswers: UserAnswer[]): number {
    return this.questions.reduce((total, question) => {
      const userAnswerForThisQuestion = userAnswers.find((userAnswer) =>
        userAnswer.questionId.equals(question.id)
      )

      if (!userAnswerForThisQuestion) return total

      return total + question.getUserAnswerPoints(userAnswerForThisQuestion)
    }, 0)
  }

  getMaxPoints(): number {
    return this.questions.reduce((total, question) => total + question.points, 0)
  }
}
