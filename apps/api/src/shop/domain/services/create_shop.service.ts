import { CreateShopDto, Shop } from '../models/shop.js'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '../../../school/domain/contracts/repositories/schools.repository.js'
import { SchoolNotFoundException } from '../../../school/domain/models/school_not_found.exception.js'
import { IShopsRepository } from '../contracts/repositories/shops.repository.js'
import { ShopCategory } from '../models/shop_category.js'
import { ShopProduct } from '../models/shop_product.js'

@inject()
export class CreateShopService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async execute(createShopDto: CreateShopDto) {
    const school = await this.schoolsRepository.getById(createShopDto.schoolId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    const shop = new Shop({
      ...createShopDto,
      categories: createShopDto.categories.map(
        (createShopCategoryDto) =>
          new ShopCategory({
            ...createShopCategoryDto,
            products: createShopCategoryDto.products.map(
              (createShopProductDto) => new ShopProduct(createShopProductDto)
            ),
          })
      ),
    })
    return this.shopsRepository.save(shop)
  }
}
