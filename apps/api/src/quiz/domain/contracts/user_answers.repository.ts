import { UserAnswer } from '../models/user_answer/user_answer.js'

export abstract class IUserAnswersRepository {
  abstract save(userAnswer: UserAnswer): Promise<UserAnswer>
  abstract empty(): Promise<void>
}
