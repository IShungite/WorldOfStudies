import { CreateQuestionDto, Question } from '#domainModels/question'
import { Id } from './id.js'
import { UserAnswer } from './user_answer.js'

export type CreateExerciceDto = {
  name: string
  questions: CreateQuestionDto[]
}

export type UpdateExerciceDto = {
  name?: string
  questions?: CreateQuestionDto[]
}

type ExerciceProps = { id?: Id; name: string; questions: Question[] }

export class Exercice {
  readonly id: Id
  readonly name: string
  readonly questions: Question[]

  constructor({ id, name, questions }: ExerciceProps) {
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
