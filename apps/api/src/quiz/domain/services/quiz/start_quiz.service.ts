import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { QuizNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_not_found.exception'
import { QuizGame } from '#quiz/domain/models/quiz/quiz_game'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesGameRepository } from '#quiz/domain/contracts/quizzes_game.repository'
import { QuizGameAlreadyStartedException } from '#quiz/domain/models/quiz/exceptions/quiz_game_already_started.exception'

@inject()
export class StartQuizService {
  constructor(
    private readonly quizzesRepository: IQuizzesRepository,
    private readonly quizzesGameRepository: IQuizzesGameRepository
  ) {}

  async execute(quizId: Id, characterId: Id): Promise<QuizGame> {
    const quiz = await this.validate(quizId, characterId)

    const quizGame = new QuizGame({
      quiz,
      characterId,
    })
    await this.quizzesGameRepository.save(quizGame)

    return quizGame
  }

  private async validate(quizId: Id, characterId: Id) {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    const gameQuiz = await this.quizzesGameRepository.getByQuizIdAndCharacterId(
      quiz.id,
      characterId
    )

    if (gameQuiz) {
      throw new QuizGameAlreadyStartedException(quiz.id)
    }

    return quiz
  }
}
