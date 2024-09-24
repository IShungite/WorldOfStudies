import GetCharacterQuizzesService from '#quiz/domain/services/quiz/get_character_quizzes.service'
import { QuizApiMapper } from '#quiz/infrastructure/mappers/quiz_api.mapper'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { PaginationApiMapper } from '#shared/pagination/infrastructure/mappers/pagination_api.mapper'
import { paginationValidator } from '#shared/pagination/infrastructure/validators/pagination.validator'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { PaginatedResponse } from '../../../../../../packages/api-types/src/pagination/paginated_response.js'
import { QuizOfCharacter } from '@world-of-studies/api-types'

@inject()
export default class GetCharacterQuizzesController {
  constructor(private readonly getCharacterQuizzesService: GetCharacterQuizzesService) {}

  async handle({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const pagination = await vine.validate({ schema: paginationValidator, data: request.qs() })

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const data = await this.getCharacterQuizzesService.execute(
      id,
      new PaginationRequest(pagination),
      user.id
    )

    const responseData: PaginatedResponse<QuizOfCharacter> = PaginationApiMapper.toResponse(
      data,
      (res) => ({
        ...QuizApiMapper.toResponse(res.quiz).result,
        last_quiz_instance_status: res.last_quiz_instance_status,
      }),
      request.url()
    )

    return response.ok(responseData)
  }
}
