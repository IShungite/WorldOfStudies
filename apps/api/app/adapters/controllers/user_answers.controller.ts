import { CreateUserAnswerService } from '#domainServices/user_answer/create_user_answer.service'
import { createUserAnswerValidator } from '#validators/create_user_answer.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { UserAnswerMapper } from '#mappers/user_answer.mapper'

@inject()
export default class UserAnswersController {
  constructor(private readonly createUserAnswer: CreateUserAnswerService) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createUserAnswerValidator, data: request.all() })

    const userAnswer = await this.createUserAnswer.execute(payload)
    return response.created(UserAnswerMapper.toResponse(userAnswer))
  }
}
