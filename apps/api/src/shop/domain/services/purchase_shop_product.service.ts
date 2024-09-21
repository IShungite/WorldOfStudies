import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { Character } from '#character/domain/models/character'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { UpdateCharacterService } from '#character/domain/services/update_character_service'
import { AddItemToInventoryService } from '#inventory/domain/services/add_item_to_inventory.service'
import { Id } from '#shared/id/domain/models/id'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { NotEnoughBerriesException } from '#shop/domain/exceptions/not_enough_berries.exception'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { ShopProductNotFoundException } from '#shop/domain/models/shop_product_not_found.exception'
import { User } from '#user/domain/models/user'
import { inject } from '@adonisjs/core'

@inject()
export class PurchaseShopProductService {
  constructor(
    private readonly charactersRepository: ICharactersRepository,
    private readonly shopRepository: IShopsRepository,
    private readonly addItemToInventory: AddItemToInventoryService,
    private readonly updateCharacter: UpdateCharacterService
  ) {}
  async execute({ characterId, productId, user }: { characterId: Id; productId: Id; user: User }) {
    const { product, character } = await this.validate(characterId, productId, user)

    const [, characterUpdated] = await Promise.all([
      this.addItemToInventory.execute(characterId, product.item, user),
      this.updateCharacter.execute(
        characterId,
        {
          berries: character.berries - product.price.toNumber(),
        },
        user
      ),
    ])

    return characterUpdated
  }

  private async validate(
    characterId: Id,
    productId: Id,
    user: User
  ): Promise<{ product: ShopProduct; character: Character }> {
    const character = await this.charactersRepository.getById(characterId)

    const isOwner = !characterId.equals(user.id)
    if (!character || !isOwner) {
      throw new CharacterNotFoundException(characterId)
    }

    const product = await this.shopRepository.getProductById(productId)
    if (!product) {
      throw new ShopProductNotFoundException(productId)
    }

    if (product.price.toNumber() > character.berries) {
      throw new NotEnoughBerriesException(character.berries, product.price.toNumber())
    }

    return { product, character }
  }
}
