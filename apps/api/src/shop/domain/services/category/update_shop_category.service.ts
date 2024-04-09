import { Id } from '../../../../shared/id/domain/models/id.js'
import { SchoolNotFoundException } from '../../../../school/domain/models/school_not_found.exception.js'
import { ISchoolsRepository } from '../../../../school/domain/contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'
import { ShopCategory, UpdateShopCategoryDto } from '../../models/shop_category.js'
import { IShopsRepository } from '../../contracts/repositories/shops.repository.js'
import { ShopNotFoundException } from '../../models/shop_not_found_exception.js'
import { ShopCategoryNotFoundException } from '../../models/shop_category_not_found_exception.js'
import { Shop } from '../../models/shop.js'

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
