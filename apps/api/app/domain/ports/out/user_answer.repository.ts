import { UserAnswer } from '#domainModels/quiz/user_answer'

export abstract class IUserAnswersRepository {
  abstract store(userAnswer: UserAnswer): Promise<UserAnswer>
}
