import { Id } from '../../../shared/id/domain/models/id.js'
import { CreateCharacterService } from '../../domain/services/create_character.service.js'
import { GetCharactersByUserIdService } from '../../domain/services/get_characters_by_user_id.service.js'
import { createCharacterValidator } from '../validators/create_character.validator.js'
import { domainIdValidator } from '../../../shared/id/infrastructure/validators/domain_id.validator.js'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { UpdateCharacterService } from '../../domain/services/update_character_service.js'
import { CharacterMapper } from '../mappers/character.mapper.js'
import { DeleteCharacterService } from '../../domain/services/delete_character.service.js'
import { UserMapper } from '../../../user/infrastructure/mappers/user.mapper.js'

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

  async charactersByUserId({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characters = await this.getCharactersByUserId.execute(id, user)
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
