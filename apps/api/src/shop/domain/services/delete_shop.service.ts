import { Id } from '../../../shared/id/domain/models/id.js'
import { ShopNotFoundException } from '../models/shop_not_found_exception.js'
import { IShopsRepository } from '../contracts/repositories/shops.repository.js'
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
