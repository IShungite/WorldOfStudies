import { Id } from '#domain/models/id/id'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { inject } from '@adonisjs/core'
import { ShopCategory, UpdateShopCategoryDto } from '#domain/models/shop/shop_category'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { ShopNotFoundException } from '#domain/models/shop/shop_not_found_exception'
import { ShopCategoryNotFoundException } from '#domain/models/shop/shop_category_not_found_exception'
import { Shop } from '#domain/models/shop/shop'

@inject()
export class UpdateShopCategoryService {
  constructor(
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly shopsRepository: IShopsRepository
  ) {}

  async execute(
    schoolId: Id,
    categoryId: Id,
    updateShopCategoryDto: UpdateShopCategoryDto
  ): Promise<Shop> {
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

    const newCategory = new ShopCategory({
      ...category,
      name: updateShopCategoryDto.name ?? category.name,
    })

    const newShop = new Shop({
      ...shop,
      categories: shop.categories.map((c) => (c.id.equals(categoryId) ? newCategory : c)),
    })

    return this.shopsRepository.save(newShop)
  }
}
