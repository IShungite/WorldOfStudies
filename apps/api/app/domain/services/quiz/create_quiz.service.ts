import { CreateQuizDto, Quiz } from '#domainModels/quiz/quiz'
import { CreateQuizUseCase } from '#domainPorts/in/quiz/create_quiz.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { QuizFactory } from '#factories/quiz.factory'
import { inject } from '@adonisjs/core'

@inject()
export class CreateQuizService implements CreateQuizUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = QuizFactory.create(createQuizDto)

    return this.quizzesRepository.save(quiz)
  }
}
