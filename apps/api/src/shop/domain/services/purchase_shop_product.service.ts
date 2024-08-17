import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopProductNotFoundException } from '#shop/domain/models/shop_product_not_found.exception'

@inject()
export class PurchaseShopProductService {
  constructor(private readonly shopRepository: IShopsRepository) {}
  async execute({ characterId, productId }: { characterId: Id; productId: Id }) {
    await this.validate(characterId, productId)
  }

  private async validate(characterId: Id, productId: Id) {
    const product = await this.shopRepository.getProductById(productId)
    if (!product) {
      throw new ShopProductNotFoundException(productId)
    }
  }
}
