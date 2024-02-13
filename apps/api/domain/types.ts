export type QuestionQcmContent = {
  type: 'qcm'
  choices: {
    id: number
    label: string
    isCorrect: boolean
  }[]
}

export type QuestionHoleTextContent = {
  type: 'text-hole'
  text: string
  answers: string[]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IQuestion {
  id: number
  createdAt: Date
  updatedAt: Date
  content: QuestionQcmContent | QuestionHoleTextContent
  isUserAnswerValid: (userAnswer: IUserAnswer) => boolean
}

export type AnswerQcmContent = {
  type: 'qcm'
  selectedId: number
}

export type AnswerHoleTextContent = {
  type: 'text-hole'
  words: string[]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IUserAnswer {
  id: number
  userId: number
  questionId: number
  createdAt: Date
  updatedAt: Date
  content: AnswerQcmContent | AnswerHoleTextContent
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IQuestionsRepository {
  getQuestions(): Promise<IQuestion[]>
}
