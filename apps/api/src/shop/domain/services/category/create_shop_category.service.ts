import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found_exception'
import { CreateShopCategoryDto, ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { Shop } from '#shop/domain/models/shop'

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
