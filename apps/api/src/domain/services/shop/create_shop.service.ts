import { CreateShopDto, Shop } from '#domain/models/shop/shop'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { ShopCategory } from '#domain/models/shop/shop_category'
import { ShopProduct } from '#domain/models/shop/shop_product'

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
