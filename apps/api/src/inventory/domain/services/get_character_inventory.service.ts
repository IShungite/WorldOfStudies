import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { InventoryNotFoundForCharacterException } from '#inventory/domain/exceptions/inventory_not_found_for_character.exception'
import { User } from '#user/domain/models/user'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'

@inject()
export class GetCharacterInventoryService {
  constructor(
    private readonly inventoryRepository: IInventoriesRepository,
    private readonly charactersRepository: ICharactersRepository
  ) {}

  async execute(characterId: Id, user: User): Promise<Inventory> {
    await this.validate(characterId, user)

    const inventory = await this.inventoryRepository.getByCharacterId(characterId)

    if (!inventory) {
      throw new InventoryNotFoundForCharacterException(characterId)
    }

    return inventory
  }

  private async validate(characterId: Id, user: User) {
    const character = await this.charactersRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    if (!character.userId.equals(user.id)) {
      throw new CharacterNotFoundException(characterId)
    }
  }
}
