import { CreateQuestionDto, Question } from '#domainModels/question'

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
}
