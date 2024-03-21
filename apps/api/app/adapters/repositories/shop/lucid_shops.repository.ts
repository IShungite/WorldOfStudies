import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { Shop } from '#domainModels/shop/shop'
import { Id } from '#domainModels/id/id'
import ShopEntity from '#models/shop/shop'
import ShopCategoryEntity from '#models/shop/shop_category'
import ShopProductEntity from '#models/shop/shop_product'
import testUtils from '@adonisjs/core/services/test_utils'
import { ShopMapper } from '#mappers/shop.mapper'

export class LucidShopsRepository implements IShopsRepository {
  async save(shop: Shop): Promise<Shop> {
    await ShopEntity.updateOrCreate(
      {
        id: Number.parseInt(shop.id.toString(), 10),
      },
      {
        schoolId: Number.parseInt(shop.schoolId.toString(), 10),
      }
    )

    await Promise.all(
      shop.categories.map(async (category) => {
        await ShopCategoryEntity.updateOrCreate(
          {
            id: Number.parseInt(category.id.toString(), 10),
          },
          {
            name: category.name,
            shopId: Number.parseInt(shop.id.toString(), 10),
          }
        )
        return Promise.all(
          category.products.map(async (product) => {
            await ShopProductEntity.updateOrCreate(
              {
                id: Number.parseInt(product.id.toString(), 10),
              },
              {
                name: product.name,
                price: product.price.toNumber(),
                categoryId: Number.parseInt(category.id.toString(), 10),
              }
            )
          })
        )
      })
    )

    return shop
  }

  async getBySchoolId(schoolId: Id): Promise<Shop | null> {
    const shop = await ShopEntity.query()
      .preload('categories', (query) => {
        query.preload('products')
      })
      .where('schoolId', Number.parseInt(schoolId.toString(), 10))
      .first()

    return shop ? ShopMapper.fromAdonis(shop) : null
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
