import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopProductNotFoundException } from '#shop/domain/models/shop_product_not_found.exception'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { User } from '#user/domain/models/user'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'
import { NotEnoughBerriesException } from '#shop/domain/exceptions/not_enough_berries.exception'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { AddItemToInventoryService } from '#inventory/domain/services/add_item_to_inventory.service'

@inject()
export class PurchaseShopProductService {
  constructor(
    private readonly charactersRepository: ICharactersRepository,
    private readonly shopRepository: IShopsRepository,
    private readonly addItemToInventory: AddItemToInventoryService
  ) {}
  async execute({ characterId, productId, user }: { characterId: Id; productId: Id; user: User }) {
    const product = await this.validate(characterId, productId, user)

    await this.addItemToInventory.execute(characterId, product.item, user)
  }

  private async validate(characterId: Id, productId: Id, user: User): Promise<ShopProduct> {
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

    return product
  }
}
