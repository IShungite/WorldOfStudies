import { IQuestion, IUserAnswer, QuestionHoleTextContent, QuestionQcmContent } from './types.js'

abstract class Question implements IQuestion {
  constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly content: IQuestion['content']
  ) {}

  isUserAnswerValid(userAnswer: IUserAnswer): boolean {
    return false
  }
}

export class QuestionQcm extends Question {
  constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly content: QuestionQcmContent
  ) {
    super(id, createdAt, updatedAt, content)
  }
  isUserAnswerValid(userAnswer: IUserAnswer): boolean {
    if (userAnswer.content.type !== 'qcm') {
      throw new Error('Invalid user answer type')
    }

    const correctAnswer = this.content.choices.find((choice) => choice.isCorrect)

    if (!correctAnswer) {
      throw new Error('No correct answer found')
    }

    return userAnswer.content.selectedId === correctAnswer.id
  }
}
