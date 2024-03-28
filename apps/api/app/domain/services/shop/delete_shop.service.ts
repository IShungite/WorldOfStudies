import { Id } from '#domainModels/id/id'
import { ShopNotFoundException } from '#domainModels/shop/shop_not_found_exception'
import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { inject } from '@adonisjs/core'

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
