import GetCharacterStatsService from '#character/domain/services/get_character_stats.service'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CharacterStatsResponse } from '@world-of-studies/api-types'

@inject()
export default class GetCharacterStatsController {
  constructor(private readonly getCharacterStatsService: GetCharacterStatsService) {}

  async handle({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characterStats = await this.getCharacterStatsService.execute(id, user.id)

    const characterStatsResponse: CharacterStatsResponse = {
      result: {
        generalAverage: characterStats.generalAverage,
        subjects: characterStats.subjects.map((subject) => ({
          name: subject.name,
          average: subject.average,
          quizzes: subject.quizzes.map((quiz) => ({
            name: quiz.name,
            score: quiz.score,
            date: quiz.date,
            maxScore: quiz.maxScore,
          })),
        })),
      },
    }

    return response.ok(characterStatsResponse)
  }
}
