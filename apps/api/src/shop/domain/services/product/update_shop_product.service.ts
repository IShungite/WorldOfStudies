import { inject } from '@adonisjs/core'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { ShopProduct, UpdateShopProductDto } from '#shop/domain/models/shop_product'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopNotFoundException } from '#shop/domain/models/shop_not_found.exception'
import { ShopCategoryNotFoundException } from '#shop/domain/models/shop_category_not_found.exception'
import { ShopProductNotFoundException } from '#shop/domain/models/shop_product_not_found.exception'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { Shop } from '#shop/domain/models/shop'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { ItemNotFoundException } from '#item/domain/models/item_not_found.exception'

@inject()
export class UpdateShopProductService {
  constructor(
    private readonly shopsRepository: IShopsRepository,
    private readonly schoolsRepository: ISchoolsRepository,
    private readonly itemsRepository: IItemRepository
  ) {}

  async execute(
    schoolId: Id,
    categoryId: Id,
    productId: Id,
    updateShopProductDto: UpdateShopProductDto
  ) {
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

    const product = category.products.find((p) => p.id.equals(productId))

    if (!product) {
      throw new ShopProductNotFoundException(productId)
    }

    const item = updateShopProductDto.itemId
      ? await this.itemsRepository.getById(updateShopProductDto.itemId)
      : product.item

    if (!item) {
      throw new ItemNotFoundException(updateShopProductDto.itemId)
    }

    const newProduct = new ShopProduct({
      ...product,
      ...updateShopProductDto,
      item,
    })

    const newCategory = new ShopCategory({
      ...category,
      products: category.products.map((p) => (p.id.equals(productId) ? newProduct : p)),
    })

    const newShop = new Shop({
      ...shop,
      categories: shop.categories.map((c) => (c.id.equals(categoryId) ? newCategory : c)),
    })

    return this.shopsRepository.save(newShop)
  }
}
