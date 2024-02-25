import { UserAnswer } from '#domainModels/exercice/user_answer'

export abstract class IUserAnswersRepository {
  abstract store(userAnswer: UserAnswer): Promise<UserAnswer>
}
