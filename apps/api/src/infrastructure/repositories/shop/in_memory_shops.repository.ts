import { IShopsRepository } from '#domain/ports/out/shops.repository'
import { Shop } from '#domain/models/shop/shop'
import { Id } from '#domain/models/id/id'

export class InMemoryShopsRepository implements IShopsRepository {
  private shops: Record<string, Shop> = {}

  async save(shop: Shop): Promise<Shop> {
    this.shops[shop.id.toString()] = shop
    return shop
  }

  async getBySchoolId(schoolId: Id): Promise<Shop | null> {
    return (
      Object.values(this.shops).find((shopToFind) => shopToFind.schoolId.equals(schoolId)) ?? null
    )
  }

  async deleteById(shopId: Id): Promise<void> {
    delete this.shops[shopId.toString()]
  }

  async empty(): Promise<void> {
    this.shops = {}
  }
}
