import { IUserAnswer } from './types.js'

export class UserAnswer implements IUserAnswer {
  constructor(
    readonly id: number,
    readonly userId: number,
    readonly questionId: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly content: IUserAnswer['content']
  ) {}
}
