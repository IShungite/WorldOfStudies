import { CreateQuestionDto, Question } from '#quiz/domain/models/quiz/question'
import { Id } from '#shared/id/domain/models/id'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'

export type CreateQuizDto = {
  name: string
  questions: CreateQuestionDto[]
}

export type UpdateQuizDto = {
  name?: string
  questions?: CreateQuestionDto[]
}

type QuizProps = { id?: Id; name: string; questions: Question[] }

export class Quiz {
  readonly id: Id
  readonly name: string
  readonly questions: Question[]

  constructor({ id, name, questions }: QuizProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.questions = questions
  }

  getTotalUserPoints(userAnswers: UserAnswer[]): number {
    return this.questions.reduce((total, question) => {
      const userAnswerForThisQuestion = userAnswers.find(
        (userAnswer) => userAnswer.questionId === question.id
      )

      if (!userAnswerForThisQuestion) return total

      return total + question.getUserAnswerPoints(userAnswerForThisQuestion)
    }, 0)
  }
}
