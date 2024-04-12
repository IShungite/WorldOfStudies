import { inject } from '@adonisjs/core'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'

@inject()
export class GetUserAnswersByQuizService {
  constructor(private readonly userAnswersRepository: IUserAnswersRepository) {}

  async execute(quizId: Id): Promise<UserAnswer[]> {
    return this.userAnswersRepository.getAllByQuizId(quizId)
  }
}
