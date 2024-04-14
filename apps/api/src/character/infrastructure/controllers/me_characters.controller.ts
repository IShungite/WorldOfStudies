import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GetCharactersByUserIdService } from '#character/domain/services/get_characters_by_user_id.service'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { CharacterApiMapper } from '#character/infrastructure/mappers/character_api.mapper'

@inject()
export default class MeCharactersController {
  constructor(private readonly getCharactersByUserIdService: GetCharactersByUserIdService) {}

  async handle({ response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const characters = await this.getCharactersByUserIdService.execute(user.id, user)

    return response.ok(CharacterApiMapper.toResponseList(characters))
  }
}
