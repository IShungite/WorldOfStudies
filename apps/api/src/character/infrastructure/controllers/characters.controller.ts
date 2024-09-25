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
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { updateCharacterValidator } from '#character/infrastructure/validators/update_character.validator'
import { CharacterApiMapper } from '#character/infrastructure/mappers/character_api.mapper'
import { GetSchoolsByCharacterIds } from '#school/domain/services/school/get_schools_by_character_ids'
import { GetCharacterByIdService } from '#character/domain/services/get_character_by_id.service'

@inject()
export default class CharactersController {
  constructor(
    private readonly createCharacterService: CreateCharacterService,
    private readonly getCharactersByUserId: GetCharactersByUserIdService,
    private readonly updateCharacterService: UpdateCharacterService,
    private readonly deleteCharacterService: DeleteCharacterService,
    private readonly getCharacterById: GetCharacterByIdService,
    private readonly getSchoolsByCharacterIds: GetSchoolsByCharacterIds
  ) {}

  async show({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const character = await this.getCharacterById.execute(id, user)

    const schools = await this.getSchoolsByCharacterIds.execute([character.id])

    return response.ok(CharacterApiMapper.toResponse(character, schools[0]))
  }

  async store({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const payload = await vine.validate({ schema: createCharacterValidator, data: request.all() })
    const character = await this.createCharacterService.execute({
      ...payload,
      userId: new Id(user.id.toString()),
      skin: 'default-skin.png',
    })

    const schools = await this.getSchoolsByCharacterIds.execute([character.id])

    return response.created(CharacterApiMapper.toResponse(character, schools[0]))
  }

  async charactersByUserId({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    const characters = await this.getCharactersByUserId.execute(id, user)

    const schools = await this.getSchoolsByCharacterIds.execute(
      characters.map((character) => character.id)
    )

    return response.ok(CharacterApiMapper.toResponseList(characters, schools))
  }

  async update({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })
    const payload = await vine.validate({ schema: updateCharacterValidator, data: request.all() })

    const character = await this.updateCharacterService.execute(id, payload, user)
    const schools = await this.getSchoolsByCharacterIds.execute([character.id])

    return response.ok(CharacterApiMapper.toResponse(character, schools[0]))
  }

  async destroy({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const id = await vine.validate({ schema: domainIdValidator, data: request.param('id') })

    await this.deleteCharacterService.execute(id, user)

    return response.noContent()
  }
}
