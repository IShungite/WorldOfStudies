import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import vine from '@vinejs/vine'
import { GetUserAnswersByQuizService } from '#quiz/domain/services/user_answer/get_user_answers_by_quiz.service'
import { UserAnswerApiMapper } from '#quiz/infrastructure/mappers/user_answer_api.mapper'

@inject()
export default class GetUserAnswersByQuizController {
  constructor(private readonly getUserAnswersByQuizService: GetUserAnswersByQuizService) {}

  async handle({ params }: HttpContext) {
    const quizId = await vine.validate({ schema: domainIdValidator, data: params.quizId })

    const userAnswers = await this.getUserAnswersByQuizService.execute(quizId)

    return userAnswers.map((userAnswer) => UserAnswerApiMapper.toResponse(userAnswer))
  }
}
