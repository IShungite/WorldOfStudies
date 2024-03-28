import { UserAnswer } from '#domain/models/quiz/user_answer'

export abstract class IUserAnswersRepository {
  abstract save(userAnswer: UserAnswer): Promise<UserAnswer>
  abstract empty(): Promise<void>
}
