import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found.exception'
import { CreateShopCategoryDto, ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { Shop } from '#shop/domain/models/shop'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { ItemNotFoundException } from '#item/domain/models/item_not_found.exception'

@inject()
export class CreateShopCategoryService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly itemsRepository: IItemRepository
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

    const createShopProductDtos = await Promise.all(
      createShopCategoryDto.products.map(async (createShopProductDto) => {
        const item = await this.itemsRepository.getById(createShopProductDto.itemId)

        if (!item) {
          throw new ItemNotFoundException(createShopProductDto.itemId)
        }

        return {
          ...createShopProductDto,
          item: item,
        }
      })
    )

    const newCategory = new ShopCategory({
      ...createShopCategoryDto,
      products: createShopProductDtos.map(
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
