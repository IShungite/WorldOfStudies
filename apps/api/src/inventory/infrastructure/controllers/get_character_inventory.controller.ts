import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { GetCharacterInventoryService } from '#inventory/domain/services/get_character_inventory.service'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { InventoryApiMapper } from '#inventory/infrastructure/mappers/inventory_api.mapper'

@inject()
export default class GetCharacterInventoryController {
  constructor(private readonly getCharacterInventoryService: GetCharacterInventoryService) {}

  async handle({ request, response, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const characterId = await vine.validate({
      schema: domainIdValidator,
      data: request.param('id'),
    })

    const inventory = await this.getCharacterInventoryService.execute(characterId, user)

    return response.ok(InventoryApiMapper.toResponse(inventory))
  }
}
