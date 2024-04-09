import { IShopsRepository } from '../../domain/contracts/repositories/shops.repository.js'
import { Shop } from '../../domain/models/shop.js'
import { Id } from '../../../shared/id/domain/models/id.js'
import ShopEntity from '../entities/shop.js'
import ShopCategoryEntity from '../entities/shop_category.js'
import ShopProductEntity from '../entities/shop_product.js'
import testUtils from '@adonisjs/core/services/test_utils'
import { ShopMapper } from '../mappers/shop.mapper.js'
import { ShopCategory } from '../../domain/models/shop_category.js'

export class LucidShopsRepository implements IShopsRepository {
  private async deleteExistingNestedEntity(shop: Shop) {
    const existingShopEntity = await this.getById(shop.id)

    if (!existingShopEntity) return

    const categoriesGrouped = existingShopEntity.categories.reduce(
      (groupedCategories, category) => {
        if (shop.categories.find((newCategory) => newCategory.id.equals(category.id))) {
          groupedCategories.toKeep.push(category)
        } else {
          groupedCategories.toRemove.push(category)
        }

        return groupedCategories
      },
      { toRemove: [] as ShopCategory[], toKeep: [] as ShopCategory[] }
    )

    const productsToRemove = categoriesGrouped.toKeep.flatMap((existingCategory) =>
      existingCategory.products.filter(
        (existingProduct) =>
          !shop.categories.find((newCategory) =>
            newCategory.products.find((newProduct) => newProduct.id.equals(existingProduct.id))
          )
      )
    )

    if (categoriesGrouped.toRemove.length > 0) {
      await ShopCategoryEntity.query()
        .whereIn(
          'id',
          categoriesGrouped.toRemove.map((category) => category.id.toString())
        )
        .delete()
    }

    if (productsToRemove.length > 0) {
      await ShopProductEntity.query()
        .whereIn(
          'id',
          productsToRemove.map((product) => product.id.toString())
        )
        .delete()
    }
  }

  async save(shop: Shop): Promise<Shop> {
    await this.deleteExistingNestedEntity(shop)
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

    return shop ? ShopMapper.fromLucid(shop) : null
  }

  async getById(shopId: Id): Promise<Shop | null> {
    const school = await ShopEntity.query()
      .where('id', shopId.toString())
      .preload('categories', (query) => query.preload('products'))
      .first()

    return school ? ShopMapper.fromLucid(school) : null
  }

  async deleteById(shopId: Id): Promise<void> {
    await ShopEntity.query().where('id', shopId.toString()).delete()
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
