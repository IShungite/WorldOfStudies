import { Id } from '#domainModels/id/id'
import { CreateCharacterService } from '#domainServices/character/create_character.service'
import { GetCharactersByUserIdService } from '#domainServices/character/get_characters_by_user_id.service'
import { createCharacterValidator } from '#validators/create_character.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { UpdateCharacterService } from '#domainServices/character/update_character_service'
import { CharacterMapper } from '#mappers/cahracter.mapper'

@inject()
export default class CharactersController {
  constructor(
    private readonly createCharacterService: CreateCharacterService,
    private readonly getCharactersByUserId: GetCharactersByUserIdService,
    private readonly updateCharacterService: UpdateCharacterService
  ) {}

  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })
    const character = await this.createCharacterService.create({
      ...payload,
      userId: new Id(user.id.toString()),
    })

    return response.created(CharacterMapper.toResponse(character))
  }

  async charactersByUserId({ request, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characters = await this.getCharactersByUserId.get(id)
    return response.ok(CharacterMapper.toResponseList(characters))
  }

  async update({ request, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })
    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })

    const character = await this.updateCharacterService.update(id, payload)

    return response.ok(CharacterMapper.toResponse(character))
  }
}
