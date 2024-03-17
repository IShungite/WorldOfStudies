import { CreateUserAnswerDto, UserAnswer } from '#domainModels/quiz/user_answer'
import { CreateUserAnswerUseCase } from '#domainPorts/in/user_answer/create_user_answer.use_case'
import { IUserAnswersRepository } from '#domainPorts/out/user_answers.repository'
import { UserAnswerFactory } from '#factories/user_answer.factory'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserAnswerService implements CreateUserAnswerUseCase {
  constructor(private readonly userAnswersRepository: IUserAnswersRepository) {}

  async create(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = UserAnswerFactory.create(createUserAnswerDto)

    return this.userAnswersRepository.save(userAnswer)
  }
}
