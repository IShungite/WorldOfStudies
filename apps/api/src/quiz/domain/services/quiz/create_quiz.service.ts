import { inject } from '@adonisjs/core'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { CreateQuizDto, Quiz } from '#quiz/domain/models/quiz/quiz'
import { QuizFactory } from '#quiz/domain/factories/quiz.factory'

@inject()
export class CreateQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = QuizFactory.create(createQuizDto)

    return this.quizzesRepository.save(quiz)
  }
}
