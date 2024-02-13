import { CreateQuestionQcmContentDto, IQuestion, IUserAnswer, QuestionQcmContent } from './types.js'
import { UserAnswerQcm } from './user_answer.js'

abstract class Question implements IQuestion {
  constructor(
    readonly id: string,
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
    readonly id: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly content: QuestionQcmContent
  ) {
    super(id, createdAt, updatedAt, content)
  }

  static create(createQuestionQcmContentDto: CreateQuestionQcmContentDto) {
    const choices = createQuestionQcmContentDto.data.choices.map((choice) => ({
      id: new Date().getTime().toString(),
      label: choice.label,
      isCorrect: choice.isCorrect,
    }))
    return new QuestionQcm('', new Date(), new Date(), {
      type: 'qcm',
      data: {
        choices,
      },
    })
  }

  isUserAnswerValid(userAnswer: UserAnswerQcm): boolean {
    const correctAnswer = this.content.data.choices.find((choice) => choice.isCorrect)

    if (!correctAnswer) {
      throw new Error('No correct answer found')
    }

    return userAnswer.content.data.selectedId === correctAnswer.id
  }
}
