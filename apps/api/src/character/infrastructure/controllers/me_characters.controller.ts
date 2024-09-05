import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GetCharactersByUserIdService } from '#character/domain/services/get_characters_by_user_id.service'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { CharacterApiMapper } from '#character/infrastructure/mappers/character_api.mapper'
import { GetSchoolsByCharacterIds } from '#school/domain/services/school/get_schools_by_character_ids'
import { CharacterResponse } from '@world-of-studies/api-types'

@inject()
export default class MeCharactersController {
  constructor(
    private readonly getCharactersByUserIdService: GetCharactersByUserIdService,
    private readonly getSchoolsByCharacterIds: GetSchoolsByCharacterIds
  ) {}

  async handle({ response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const characters = await this.getCharactersByUserIdService.execute(user.id, user)

    const schools = await this.getSchoolsByCharacterIds.execute(
      characters.map((character) => character.id)
    )

    const listResponse = CharacterApiMapper.toResponseList(characters, schools)

    return response.ok({
      ...listResponse,
      results: listResponse.results.map((value: CharacterResponse) => {
        return {
          ...value,
          result: {
            ...value.result,
          },
        }
      }),
    })
  }
}
