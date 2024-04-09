import { CreateQuizDto, Quiz } from '../../models/quiz/quiz.js'
import { IQuizzesRepository } from '../../contracts/quizzes.repository.js'
import { QuizFactory } from '../../factories/quiz.factory.js'
import { inject } from '@adonisjs/core'

@inject()
export class CreateQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = QuizFactory.create(createQuizDto)

    return this.quizzesRepository.save(quiz)
  }
}
