import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found_exception'
import { ShopCategoryNotFoundException } from '#shop/domain/models/shop_category_not_found_exception'
import { Shop } from '#shop/domain/models/shop'

@inject()
export class DeleteShopCategoryService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async execute(schoolId: Id, categoryId: Id) {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    const shop = await this.shopsRepository.getBySchoolId(schoolId)

    if (!shop) {
      throw new ShopNotFoundException()
    }

    const category = await shop.categories.find((c) => c.id.equals(categoryId))

    if (!category) {
      throw new ShopCategoryNotFoundException(categoryId)
    }

    const newShop = new Shop({
      ...shop,
      categories: shop.categories.filter((c) => !c.id.equals(categoryId)),
    })

    return this.shopsRepository.save(newShop)
  }
}
