import { Shop } from '../../models/shop.js'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '../../../../school/domain/contracts/repositories/schools.repository.js'
import { SchoolNotFoundException } from '../../../../school/domain/models/school_not_found.exception.js'
import { IShopsRepository } from '../../contracts/repositories/shops.repository.js'
import { CreateShopCategoryDto, ShopCategory } from '../../models/shop_category.js'
import { ShopProduct } from '../../models/shop_product.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { ShopNotFoundException } from '../../models/shop_not_found_exception.js'

@inject()
export class CreateShopCategoryService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async execute(schoolId: Id, createShopCategoryDto: CreateShopCategoryDto) {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    const shop = await this.shopsRepository.getBySchoolId(schoolId)

    if (!shop) {
      throw new ShopNotFoundException()
    }

    const newCategory = new ShopCategory({
      ...createShopCategoryDto,
      products: createShopCategoryDto.products.map(
        (createShopProductDto) => new ShopProduct(createShopProductDto)
      ),
    })

    const newShop = new Shop({
      ...shop,
      categories: [...shop.categories, newCategory],
    })

    return this.shopsRepository.save(newShop)
  }
}
