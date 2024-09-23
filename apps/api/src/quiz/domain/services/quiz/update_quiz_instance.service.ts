import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstanceNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_instance_not_found.exception'
import { QuizInstance, UpdateQuizInstanceDto } from '#quiz/domain/models/quiz/quiz_instance'
import { Id } from '#shared/id/domain/models/id'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateQuizInstanceService {
  constructor(private readonly quizInstancesRepository: IQuizzesInstanceRepository) {}

  async execute(
    quizInstanceId: Id,
    updateQuizInstanceDto: UpdateQuizInstanceDto
  ): Promise<QuizInstance> {
    const quizInstance = await this.quizInstancesRepository.getById(quizInstanceId)

    if (!quizInstance) {
      throw new QuizInstanceNotFoundException(quizInstanceId)
    }

    const quizInstanceUpdated = new QuizInstance({
      ...quizInstance,
      ...updateQuizInstanceDto,
    })

    return this.quizInstancesRepository.save(quizInstanceUpdated)
  }
}
