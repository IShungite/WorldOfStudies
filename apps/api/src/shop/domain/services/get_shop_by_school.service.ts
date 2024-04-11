import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found_exception'

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
