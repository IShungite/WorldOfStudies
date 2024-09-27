import { inject } from '@adonisjs/core'
import { StartQuizService } from '#quiz/domain/services/quiz/start_quiz.service'
import { Id } from '#shared/id/domain/models/id'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { IIARepository } from '#quiz/domain/contracts/ia.repository'
import { CreateQuizService } from '#quiz/domain/services/quiz/create_quiz.service'
import { Quiz } from '#quiz/domain/models/quiz/quiz'

@inject()
export class GenerateIaQuizService {
  constructor(
    private readonly createQuizService: CreateQuizService,
    private readonly iaRepository: IIARepository,
    private readonly startQuizService: StartQuizService
  ) {}

  async execute(generateParams: any, characterId: Id): Promise<Quiz> {
    const createQuizDto = await this.iaRepository.generate(generateParams)

    const quiz = await this.createQuizService.execute(createQuizDto)

    // const quizInstance = await this.startQuizService.execute(quiz.id, characterId)

    return quiz
  }
}
