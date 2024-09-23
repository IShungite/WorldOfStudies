import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { QuizNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_not_found.exception'
import { QuizInstance, QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstanceAlreadyExists } from '#quiz/domain/models/quiz/exceptions/quiz_instance_already_exists.exception'

@inject()
export class StartQuizService {
  constructor(
    private readonly quizzesRepository: IQuizzesRepository,
    private readonly quizzesInstanceRepository: IQuizzesInstanceRepository
  ) {}

  async execute(quizId: Id, characterId: Id): Promise<QuizInstance> {
    const quiz = await this.validate(quizId, characterId)

    const quizInstance = new QuizInstance({
      quiz,
      characterId,
      userAnswers: [],
      status: QuizInstanceStatus.IN_PROGRESS,
    })
    await this.quizzesInstanceRepository.save(quizInstance)

    return quizInstance
  }

  private async validate(quizId: Id, characterId: Id) {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    const gameQuiz = await this.quizzesInstanceRepository.getByQuizIdAndCharacterId(
      quiz.id,
      characterId
    )

    if (gameQuiz) {
      throw new QuizInstanceAlreadyExists(quiz.id)
    }

    return quiz
  }
}
