import { UserAnswer } from '../../../domain/models/user_answer/user_answer.js'
import { IUserAnswersRepository } from '../../../domain/contracts/user_answers.repository.js'

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
