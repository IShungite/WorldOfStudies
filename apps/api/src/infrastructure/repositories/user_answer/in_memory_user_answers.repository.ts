import { UserAnswer } from '#domain/models/quiz/user_answer'
import { IUserAnswersRepository } from '#domain/ports/out/user_answers.repository'

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
