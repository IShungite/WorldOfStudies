import { Shop } from '#domain/models/shop/shop'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { CreateShopCategoryDto, ShopCategory } from '#domain/models/shop/shop_category'
import { ShopProduct } from '#domain/models/shop/shop_product'
import { Id } from '#domain/models/id/id'
import { ShopNotFoundException } from '#domain/models/shop/shop_not_found_exception'

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
