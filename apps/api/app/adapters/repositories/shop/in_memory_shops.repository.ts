import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { Shop } from '#domainModels/shop/shop'
import { Id } from '#domainModels/id/id'

export class InMemoryShopsRepository implements IShopsRepository {
  private readonly shops: Record<string, Shop> = {}

  async save(shop: Shop): Promise<Shop> {
    this.shops[shop.id.toString()] = shop
    return shop
  }

  async getBySchoolId(schoolId: Id): Promise<Shop | null> {
    return Object.values(this.shops).find((shop) => shop.schoolId.equals(schoolId)) ?? null
  }
}
