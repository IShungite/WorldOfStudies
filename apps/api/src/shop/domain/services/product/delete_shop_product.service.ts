import { Shop } from '../../models/shop.js'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '../../../../school/domain/contracts/repositories/schools.repository.js'
import { SchoolNotFoundException } from '../../../../school/domain/models/school_not_found.exception.js'
import { IShopsRepository } from '../../contracts/repositories/shops.repository.js'
import { ShopCategory } from '../../models/shop_category.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { ShopNotFoundException } from '../../models/shop_not_found_exception.js'
import { ShopCategoryNotFoundException } from '../../models/shop_category_not_found_exception.js'
import { ShopProductNotFoundException } from '../../models/shop_product_not_found_exception.js'

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
