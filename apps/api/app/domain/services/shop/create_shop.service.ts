import { CreateShopDto, Shop } from '#domainModels/shop/shop'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { ShopCategory } from '#domainModels/shop/shop_category'
import { ShopProduct } from '#domainModels/shop/shop_product'

@inject()
export class CreateShopService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async create(createShopDto: CreateShopDto) {
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
