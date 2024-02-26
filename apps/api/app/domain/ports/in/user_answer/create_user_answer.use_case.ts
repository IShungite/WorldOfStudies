import { CreateUserAnswerDto, UserAnswer } from '#domainModels/quiz/user_answer'

export interface CreateUserAnswerUseCase {
  create: (createQuizDto: CreateUserAnswerDto) => Promise<UserAnswer>
}
