import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreateShopDto, Shop } from '#shop/domain/models/shop'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { ItemNotFoundException } from '#item/domain/models/item_not_found.exception'

@inject()
export class CreateShopService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly itemsRepository: IItemRepository
  ) {}

  async execute(createShopDto: CreateShopDto) {
    const school = await this.schoolsRepository.getById(createShopDto.schoolId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    const shopCategories = await Promise.all(
      createShopDto.categories.map(async (createShopCategoryDto) => {
        const shopProducts = await Promise.all(
          createShopCategoryDto.products.map(async (createShopProductDto) => {
            const item = await this.itemsRepository.getById(createShopProductDto.itemId)

            if (!item) {
              throw new ItemNotFoundException(createShopProductDto.itemId)
            }

            return new ShopProduct({
              ...createShopProductDto,
              item: item,
            })
          })
        )

        return new ShopCategory({
          ...createShopCategoryDto,
          products: shopProducts,
        })
      })
    )

    const shop = new Shop({
      ...createShopDto,
      categories: shopCategories,
    })

    return this.shopsRepository.save(shop)
  }
}
