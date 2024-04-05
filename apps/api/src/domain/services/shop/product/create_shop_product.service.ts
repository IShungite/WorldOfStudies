import { Shop } from '#domain/models/shop/shop'
import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { ShopCategory } from '#domain/models/shop/shop_category'
import { CreateShopProductDto, ShopProduct } from '#domain/models/shop/shop_product'
import { Id } from '#domain/models/id/id'
import { ShopNotFoundException } from '#domain/models/shop/shop_not_found_exception'
import { ShopCategoryNotFoundException } from '#domain/models/shop/shop_category_not_found_exception'

@inject()
export class CreateShopProductService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository
  ) {}

  async execute(schoolId: Id, categoryId: Id, createShopProductDto: CreateShopProductDto) {
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
      products: [...category.products, new ShopProduct(createShopProductDto)],
    })

    const newShop = new Shop({
      ...shop,
      categories: shop.categories.map((c) => (c.id.equals(categoryId) ? newCategory : c)),
    })

    return this.shopsRepository.save(newShop)
  }
}
