import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { Id } from '#domainModels/id/id'
import { ShopNotFoundException } from '#domainModels/shop/shop_not_found_exception'
import { inject } from '@adonisjs/core'

@inject()
export class GetShopBySchoolService {
  constructor(private readonly shopRepository: IShopsRepository) {}
  async execute(id: Id) {
    const shop = await this.shopRepository.getBySchoolId(id)

    if (!shop) {
      throw new ShopNotFoundException()
    }

    return shop
  }
}
