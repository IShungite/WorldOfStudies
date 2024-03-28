import { CreateQuizDto, Quiz } from '#domainModels/quiz/quiz'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { QuizFactory } from '#factories/quiz.factory'
import { inject } from '@adonisjs/core'

@inject()
export class CreateQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = QuizFactory.create(createQuizDto)

    return this.quizzesRepository.save(quiz)
  }
}
