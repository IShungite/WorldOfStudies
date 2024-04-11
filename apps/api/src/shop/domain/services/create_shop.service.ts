import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreateShopDto, Shop } from '#shop/domain/models/shop'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'

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
