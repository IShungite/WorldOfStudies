import { UserAnswer } from '#domainModels/quiz/user_answer'
import { IUserAnswersRepository } from '#domainPorts/out/user_answer.repository'

export class InMemoryUserAnswersRepository implements IUserAnswersRepository {
  private userAnswers: Record<string, UserAnswer> = {}

  async store(userAnswer: UserAnswer): Promise<UserAnswer> {
    this.userAnswers[userAnswer.id.toString()] = userAnswer
    return userAnswer
  }
}
