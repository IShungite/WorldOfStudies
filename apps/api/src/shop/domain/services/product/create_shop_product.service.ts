import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found.exception'
import { ShopCategoryNotFoundException } from '#shop/domain/models/shop_category_not_found.exception'
import { CreateShopProductDto, ShopProduct } from '#shop/domain/models/shop_product'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { Shop } from '#shop/domain/models/shop'
import { ItemNotFoundException } from '#item/domain/models/item_not_found.exception'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'

@inject()
export class CreateShopProductService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly itemsRepository: IItemRepository
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

    const item = await this.itemsRepository.getById(createShopProductDto.itemId)

    if (!item) {
      throw new ItemNotFoundException(createShopProductDto.itemId)
    }

    const newCategory = new ShopCategory({
      ...category,
      products: [...category.products, new ShopProduct({ ...createShopProductDto, item })],
    })

    const newShop = new Shop({
      ...shop,
      categories: shop.categories.map((c) => (c.id.equals(categoryId) ? newCategory : c)),
    })

    return this.shopsRepository.save(newShop)
  }
}
