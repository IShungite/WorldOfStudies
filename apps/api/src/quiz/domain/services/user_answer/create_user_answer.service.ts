import { inject } from '@adonisjs/core'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { CreateUserAnswerDto, UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { UserAnswerFactory } from '#quiz/domain/factories/user_answer.factory'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstanceNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_instance_not_found.exception'
import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { UpdateQuizInstanceService } from '#quiz/domain/services/quiz/update_quiz_instance.service'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { UpdateCharacterService } from '#character/domain/services/update_character_service'

@inject()
export class CreateUserAnswerService {
  constructor(
    private readonly charactersRepository: ICharactersRepository,
    private readonly userAnswersRepository: IUserAnswersRepository,
    private readonly quizInstancesRepository: IQuizzesInstanceRepository,
    private readonly updateQuizInstanceService: UpdateQuizInstanceService,
    private readonly updateCharacterService: UpdateCharacterService
  ) {}

  async execute(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = UserAnswerFactory.create(createUserAnswerDto)

    const userAnswerSaved = await this.userAnswersRepository.save(userAnswer)

    const quizInstance = await this.quizInstancesRepository.getById(userAnswer.quizInstanceId)

    if (!quizInstance) {
      throw new QuizInstanceNotFoundException(userAnswer.quizInstanceId)
    }

    const character = await this.charactersRepository.getById(quizInstance.characterId)

    if (!character) {
      throw new CharacterNotFoundException(quizInstance.characterId)
    }

    if (quizInstance.userAnswers.length === quizInstance.quiz.questions.length) {
      await Promise.all([
        this.updateQuizInstanceService.execute(quizInstance.id, {
          status: QuizInstanceStatus.COMPLETED,
        }),
        this.updateCharacterService.execute(character.id, {
          berries: character.berries + Math.round(quizInstance.getTotalUserPoints()),
        }),
      ])
    }

    return userAnswerSaved
  }
}
