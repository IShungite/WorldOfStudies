import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { Shop } from '#domainModels/shop/shop'
import { Id } from '#domainModels/id/id'
import ShopEntity from '#models/shop'

export class LucidShopsRepository implements IShopsRepository {
  async save(shop: Shop): Promise<Shop> {
    const shop = ShopEntity.updateOrCreate()
  }

  async getBySchoolId(schoolId: Id): Promise<Shop | null> {
    return (
      Object.values(this.shops).find((shopToFind) => shopToFind.schoolId.equals(schoolId)) ?? null
    )
  }
}
