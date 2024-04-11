import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found_exception'

@inject()
export class DeleteShopService {
  constructor(private readonly shopRepository: IShopsRepository) {}

  async execute(schoolId: Id): Promise<void> {
    const shop = await this.shopRepository.getBySchoolId(schoolId)

    if (!shop) {
      throw new ShopNotFoundException()
    }

    await this.shopRepository.deleteById(shop.id)
  }
}
