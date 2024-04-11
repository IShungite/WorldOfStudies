import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'

export class InMemoryUserAnswersRepository implements IUserAnswersRepository {
  private userAnswers: Record<string, UserAnswer> = {}

  async save(userAnswer: UserAnswer): Promise<UserAnswer> {
    this.userAnswers[userAnswer.id.toString()] = userAnswer
    return userAnswer
  }

  async empty(): Promise<void> {
    this.userAnswers = {}
  }
}
