import { IShopsRepository } from '../contracts/repositories/shops.repository.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import { ShopNotFoundException } from '../models/shop_not_found_exception.js'
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
