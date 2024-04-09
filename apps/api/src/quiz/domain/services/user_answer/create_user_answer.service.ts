import { CreateUserAnswerDto, UserAnswer } from '../../models/user_answer/user_answer.js'
import { IUserAnswersRepository } from '../../contracts/user_answers.repository.js'
import { UserAnswerFactory } from '../../factories/user_answer.factory.js'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserAnswerService {
  constructor(private readonly userAnswersRepository: IUserAnswersRepository) {}

  async execute(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = UserAnswerFactory.create(createUserAnswerDto)

    return this.userAnswersRepository.save(userAnswer)
  }
}
