import testUtils from '@adonisjs/core/services/test_utils'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopStorageMapper } from '#shop/infrastructure/mappers/shop_storage.mapper'
import { Shop } from '#shop/domain/models/shop'
import { ShopCategory } from '#shop/domain/models/shop_category'
import ShopCategoryEntity from '#shop/infrastructure/entities/shop_category'
import ShopProductEntity from '#shop/infrastructure/entities/shop_product'
import ShopEntity from '#shop/infrastructure/entities/shop'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { ShopProductStorageMapper } from '#shop/infrastructure/mappers/shop_product_storage.mapper'

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
                itemId: Number.parseInt(product.item.id.toString(), 10),
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
      .preload('categories', (queryCategory) => {
        queryCategory.preload('products', (queryProduct) => queryProduct.preload('item'))
      })
      .where('schoolId', Number.parseInt(schoolId.toString(), 10))
      .first()

    return shop ? ShopStorageMapper.fromLucid(shop) : null
  }

  async getById(shopId: Id): Promise<Shop | null> {
    const school = await ShopEntity.query()
      .where('id', shopId.toString())
      .preload('categories', (categoryQuery) =>
        categoryQuery.preload('products', (productQuery) => productQuery.preload('item'))
      )
      .first()

    return school ? ShopStorageMapper.fromLucid(school) : null
  }

  async getProductById(productId: Id): Promise<ShopProduct | null> {
    const product = await ShopProductEntity.query()
      .preload('item')
      .where('id', productId.toString())
      .first()

    return product ? ShopProductStorageMapper.fromLucid(product) : null
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
