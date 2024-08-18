import { inject } from '@adonisjs/core'
import { Id } from '#shared/id/domain/models/id'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { InventoryAlreadyExistsForCharacterException } from '#inventory/domain/exceptions/inventory_already_exists_for_character.exception'

@inject()
export class CreateInventoryForCharacterService {
  constructor(
    private readonly inventoryRepository: IInventoriesRepository,
    private readonly charactersRepository: ICharactersRepository
  ) {}

  async execute(characterId: Id): Promise<Inventory> {
    await this.validate(characterId)

    return await this.inventoryRepository.saveForCharacter(
      characterId,
      new Inventory({ items: [] })
    )
  }

  private async validate(characterId: Id) {
    const character = await this.charactersRepository.getById(characterId)

    if (!character) {
      throw new CharacterNotFoundException(characterId)
    }

    const inventory = await this.inventoryRepository.getByCharacterId(characterId)

    if (inventory) {
      throw new InventoryAlreadyExistsForCharacterException(characterId)
    }
  }
}
