import { UserAnswer } from '#domainModels/quiz/user_answer'

export abstract class IUserAnswersRepository {
  abstract save(userAnswer: UserAnswer): Promise<UserAnswer>
  abstract empty(): Promise<void>
}
