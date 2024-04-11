import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'

export abstract class IUserAnswersRepository {
  abstract save(userAnswer: UserAnswer): Promise<UserAnswer>
  abstract empty(): Promise<void>
}
