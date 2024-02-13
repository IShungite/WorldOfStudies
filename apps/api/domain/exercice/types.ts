export type QuestionQcmContent = {
  type: 'qcm'
  data: {
    choices: {
      id: string
      label: string
      isCorrect: boolean
    }[]
  }
}

export type CreateQuestionQcmContentDto = {
  type: 'qcm'
  data: {
    choices: {
      label: string
      isCorrect: boolean
    }[]
  }
}

export type QuestionHoleTextContent = {
  type: 'text-hole'
  data: {
    text: string
    answers: string[]
  }
}

export type CreateQuestionHoleTextContentDto = QuestionHoleTextContent

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IQuestion {
  id: string
  createdAt: Date
  updatedAt: Date
  content: QuestionQcmContent | QuestionHoleTextContent
  isUserAnswerValid: (userAnswer: IUserAnswer) => boolean
}

export type AnswerQcmContent = {
  type: 'qcm'
  data: {
    selectedId: string
  }
}

export type AnswerHoleTextContent = {
  type: 'text-hole'
  data: {
    words: string[]
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IUserAnswer {
  id: string
  userId: string
  questionId: string
  createdAt: Date
  updatedAt: Date
  content: AnswerQcmContent | AnswerHoleTextContent
}
