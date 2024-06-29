import { inject } from '@adonisjs/core'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'

@inject()
export class GetUserAnswersByQuizInstanceService {
  constructor(private readonly userAnswersRepository: IUserAnswersRepository) {}

  async execute(quizInstanceId: Id): Promise<UserAnswer[]> {
    return this.userAnswersRepository.getAllByQuizInstanceId(quizInstanceId)
  }
}
