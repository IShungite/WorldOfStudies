import { CreateQuizDto, Quiz } from '#domainModels/quiz/quiz'

export interface CreateQuizUseCase {
  create: (createQuizDto: CreateQuizDto) => Promise<Quiz>
}
