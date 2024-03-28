import { CreateQuizDto, Quiz } from '#domain/models/quiz/quiz'
import { IQuizzesRepository } from '#domain/contracts/repositories/quizzes.repository'
import { QuizFactory } from '#domain/factories/quiz.factory'
import { inject } from '@adonisjs/core'

@inject()
export class CreateQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = QuizFactory.create(createQuizDto)

    return this.quizzesRepository.save(quiz)
  }
}
