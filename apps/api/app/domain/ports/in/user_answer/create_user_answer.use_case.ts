import { CreateUserAnswerDto, UserAnswer } from '#domainModels/exercice/user_answer'

export interface CreateUserAnswerUseCase {
  create: (createExerciceDto: CreateUserAnswerDto) => Promise<UserAnswer>
}
