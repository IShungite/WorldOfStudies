import { Shop } from '#domain/models/shop/shop'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { ShopCategory } from '#domain/models/shop/shop_category'
import { Id } from '#domain/models/id/id'
import { ShopNotFoundException } from '#domain/models/shop/shop_not_found_exception'
import { ShopCategoryNotFoundException } from '#domain/models/shop/shop_category_not_found_exception'
import { ShopProductNotFoundException } from '#domain/models/shop/shop_product_not_found_exception'

@inject()
export class DestroyShopProductService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async execute(schoolId: Id, categoryId: Id, productId: Id) {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    const shop = await this.shopsRepository.getBySchoolId(schoolId)

    if (!shop) {
      throw new ShopNotFoundException()
    }

    const category = shop.categories.find((c) => c.id.equals(categoryId))

    if (!category) {
      throw new ShopCategoryNotFoundException(categoryId)
    }

    const product = category.products.find((p) => p.id.equals(productId))

    if (!product) {
      throw new ShopProductNotFoundException(productId)
    }

    const newCategory = new ShopCategory({
      ...category,
      products: category.products.filter((p) => !p.id.equals(productId)),
    })

    const newShop = new Shop({
      ...shop,
      categories: shop.categories.map((c) => (c.id.equals(categoryId) ? newCategory : c)),
    })

    return this.shopsRepository.save(newShop)
  }
}
