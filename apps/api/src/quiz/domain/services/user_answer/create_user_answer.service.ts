import { inject } from '@adonisjs/core'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { CreateUserAnswerDto, UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { UserAnswerFactory } from '#quiz/domain/factories/user_answer.factory'

@inject()
export class CreateUserAnswerService {
  constructor(private readonly userAnswersRepository: IUserAnswersRepository) {}

  async execute(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = UserAnswerFactory.create(createUserAnswerDto)

    return this.userAnswersRepository.save(userAnswer)
  }
}
