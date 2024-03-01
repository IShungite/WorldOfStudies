import { Id } from '#domainModels/id'
import { CreateCharacterService } from '#domainServices/character/create_character.service'
import { GetCharactersByUserIdService } from '#domainServices/character/get_characters_by_user_id.service'
import { createCharacterValidator } from '#validators/create_character.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class CharactersController {
  constructor(
    private readonly createCharacterService: CreateCharacterService,
    private readonly getCharactersByUserId: GetCharactersByUserIdService
  ) {}

  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })
    const character = await this.createCharacterService.create({
      ...payload,
      userId: new Id(user.id.toString()),
    })

    return response.created({
      id: character.id.toString(),
      name: character.name,
      userId: character.userId.toString(),
    })
  }

  async charactersByUserId({ request, response, auth }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characters = await this.getCharactersByUserId.get(id)
    return response.ok(characters)
  }
}
