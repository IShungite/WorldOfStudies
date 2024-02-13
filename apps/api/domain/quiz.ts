import { CreateQuestionDto, Question } from '#domain/question'

export type CreateQuizDto = {
  name: string
  questions: CreateQuestionDto[]
}

export type UpdateQuizDto = {
  name?: string
  questions?: CreateQuestionDto[]
}

export class Quiz {
  readonly id: string
  constructor(
    readonly name: string,
    readonly questions: Question[],
    id?: string
  ) {
    this.id = id ?? String(Math.random())
  }

  addQuestion(question: Question) {
    this.questions.push(question)
  }
}
