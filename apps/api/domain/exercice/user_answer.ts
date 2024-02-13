import { AnswerQcmContent, CreateQuestionQcmContentDto, IUserAnswer } from './types.js'

export class UserAnswer implements IUserAnswer {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly questionId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly content: IUserAnswer['content']
  ) {}
}

export class UserAnswerQcm extends UserAnswer {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly questionId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly content: AnswerQcmContent
  ) {
    super(id, userId, questionId, createdAt, updatedAt, content)
  }

  static create(createQuestionQcmContentDto: CreateQuestionQcmContentDto) {
    const choices = createQuestionQcmContentDto.data.choices.map((choice) => ({
      id: new Date().getTime().toString(),
      label: choice.label,
      isCorrect: choice.isCorrect,
    }))
    return new UserAnswerQcm('', '', '', new Date(), new Date(), {
      type: 'qcm',
      data: {},
    })
  }
}
