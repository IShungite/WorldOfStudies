import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopProductNotFoundException } from '#shop/domain/models/shop_product_not_found.exception'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { User } from '#user/domain/models/user'
import { CharacterNotFoundException } from '#character/domain/models/character_not_found.exception'

@inject()
export class PurchaseShopProductService {
  constructor(
    private readonly charactersRepository: ICharactersRepository,
    private readonly shopRepository: IShopsRepository
  ) {}
  async execute({ characterId, productId, user }: { characterId: Id; productId: Id; user: User }) {
    await this.validate(characterId, productId, user)
  }

  private async validate(characterId: Id, productId: Id, user: User) {
    const character = await this.charactersRepository.getById(characterId)

    const isOwner = !characterId.equals(user.id)
    if (!character || !isOwner) {
      throw new CharacterNotFoundException(characterId)
    }

    const product = await this.shopRepository.getProductById(productId)
    if (!product) {
      throw new ShopProductNotFoundException(productId)
    }
  }
}
