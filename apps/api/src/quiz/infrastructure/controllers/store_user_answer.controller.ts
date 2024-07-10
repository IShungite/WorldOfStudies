import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreateUserAnswerService } from '#quiz/domain/services/user_answer/create_user_answer.service'
import { createUserAnswerValidator } from '#quiz/infrastructure/validators/create_user_answer.validator'
import { UserAnswerApiMapper } from '#quiz/infrastructure/mappers/user_answer_api.mapper'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

@inject()
export default class StoreUserAnswerController {
  constructor(private readonly createUserAnswer: CreateUserAnswerService) {}

  async handle({ request, response }: HttpContext) {
    const [quizInstanceId, questionId, payload] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: request.param('quizInstanceId'),
      }),
      vine.validate({
        schema: domainIdValidator,
        data: request.param('questionId'),
      }),
      vine.validate({
        schema: createUserAnswerValidator,
        data: request.all(),
      }),
    ])

    const userAnswer = await this.createUserAnswer.execute({
      ...payload,
      quizInstanceId: quizInstanceId,
      questionId: questionId,
    })
    return response.created(UserAnswerApiMapper.toResponse(userAnswer))
  }
}
