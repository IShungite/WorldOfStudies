import { Id } from '#domain/models/id/id'
import { CreateCharacterService } from '#domain/services/character/create_character.service'
import { GetCharactersByUserIdService } from '#domain/services/character/get_characters_by_user_id.service'
import { createCharacterValidator } from '#infrastructure/validators/create_character.validator'
import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { UpdateCharacterService } from '#domain/services/character/update_character_service'
import { CharacterMapper } from '#infrastructure/mappers/character.mapper'
import { DeleteCharacterService } from '#domain/services/character/delete_character.service'
import { UserMapper } from '#infrastructure/mappers/user.mapper'

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
    const user = UserMapper.fromLucid(userEntity)

    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })
    const character = await this.createCharacterService.execute({
      ...payload,
      userId: new Id(user.id.toString()),
    })

    return response.created(CharacterMapper.toResponse(character))
  }

  async charactersByUserId({ request, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characters = await this.getCharactersByUserId.execute(id)
    return response.ok(CharacterMapper.toResponseList(characters))
  }

  async update({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })
    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })

    const character = await this.updateCharacterService.execute(id, payload, user)

    return response.ok(CharacterMapper.toResponse(character))
  }
  async destroy({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    await this.deleteCharacterService.execute(id, user)

    return response.noContent()
  }
}
