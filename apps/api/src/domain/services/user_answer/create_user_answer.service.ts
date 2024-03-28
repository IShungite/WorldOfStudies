import { CreateUserAnswerDto, UserAnswer } from '#domain/models/quiz/user_answer'
import { IUserAnswersRepository } from '#domain/ports/out/user_answers.repository'
import { UserAnswerFactory } from '#domain/factories/user_answer.factory'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserAnswerService {
  constructor(private readonly userAnswersRepository: IUserAnswersRepository) {}

  async execute(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = UserAnswerFactory.create(createUserAnswerDto)

    return this.userAnswersRepository.save(userAnswer)
  }
}
