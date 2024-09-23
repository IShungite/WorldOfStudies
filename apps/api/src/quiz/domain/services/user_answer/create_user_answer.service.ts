import { inject } from '@adonisjs/core'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import { CreateUserAnswerDto, UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { UserAnswerFactory } from '#quiz/domain/factories/user_answer.factory'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstanceNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_instance_not_found.exception'
import { QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { UpdateQuizInstanceService } from '#quiz/domain/services/quiz/update_quiz_instance.service'

@inject()
export class CreateUserAnswerService {
  constructor(
    private readonly userAnswersRepository: IUserAnswersRepository,
    private readonly quizInstancesRepository: IQuizzesInstanceRepository,
    private readonly updateQuizInstanceService: UpdateQuizInstanceService
  ) {}

  async execute(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const userAnswer = UserAnswerFactory.create(createUserAnswerDto)

    const userAnswerSaved = await this.userAnswersRepository.save(userAnswer)

    const quizInstance = await this.quizInstancesRepository.getById(userAnswer.quizInstanceId)

    if (!quizInstance) {
      throw new QuizInstanceNotFoundException(userAnswer.quizInstanceId)
    }

    if (quizInstance.userAnswers.length === quizInstance.quiz.questions.length) {
      await this.updateQuizInstanceService.execute(quizInstance.id, {
        status: QuizInstanceStatus.COMPLETED,
      })
    }

    return userAnswerSaved
  }
}
