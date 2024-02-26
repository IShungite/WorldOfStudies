import { UserAnswer } from '#domainModels/quiz/user_answer'

export abstract class IUserAnswersRepository {
  abstract create(userAnswer: UserAnswer): Promise<UserAnswer>
}
