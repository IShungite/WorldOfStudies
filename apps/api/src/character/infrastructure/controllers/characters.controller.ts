import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreateCharacterService } from '#character/domain/services/create_character.service'
import { GetCharactersByUserIdService } from '#character/domain/services/get_characters_by_user_id.service'
import { UpdateCharacterService } from '#character/domain/services/update_character_service'
import { DeleteCharacterService } from '#character/domain/services/delete_character.service'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { createCharacterValidator } from '#character/infrastructure/validators/create_character.validator'
import { Id } from '#shared/id/domain/models/id'
import { CharacterMapper } from '#character/infrastructure/mappers/character.mapper'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

@inject()
export default class CharactersController {
  constructor(
    private readonly createCharacterService: CreateCharacterService,
    private readonly getCharactersByUserId: GetCharactersByUserIdService,
    private readonly updateCharacterService: UpdateCharacterService,
    private readonly deleteCharacterService: DeleteCharacterService
  ) {}

  async store({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })
    const character = await this.createCharacterService.execute({
      ...payload,
      userId: new Id(user.id.toString()),
    })

    return response.created(CharacterMapper.toResponse(character))
  }

  async charactersByUserId({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characters = await this.getCharactersByUserId.execute(id, user)
    return response.ok(CharacterMapper.toResponseList(characters))
  }

  async update({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })
    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })

    const character = await this.updateCharacterService.execute(id, payload, user)

    return response.ok(CharacterMapper.toResponse(character))
  }

  async destroy({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    await this.deleteCharacterService.execute(id, user)

    return response.noContent()
  }
}
