import { CreateQuestionDto, Question } from '#domainModels/question'
import { UserAnswer } from './user_answer.js'

export type CreateQuizDto = {
  name: string
  questions: CreateQuestionDto[]
}

export type UpdateQuizDto = {
  name?: string
  questions?: CreateQuestionDto[]
}

type QuizProps = { id?: string; name: string; questions: Question[] }

export class Quiz {
  readonly id: string
  readonly name: string
  readonly questions: Question[]

  constructor({ id, name, questions }: QuizProps) {
    this.id = id ?? String(Math.random())
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
