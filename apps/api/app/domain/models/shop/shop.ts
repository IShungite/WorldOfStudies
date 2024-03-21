import { Id } from '#domainModels/id/id'
import { CreateShopCategoryDto, ShopCategory } from '#domainModels/shop/shop_category'

export type CreateShopDto = {
  schoolId: Id
  categories: CreateShopCategoryDto[]
}

type ShopProps = {
  id?: Id
  schoolId: Id
  categories: ShopCategory[]
}

export class Shop {
  readonly id: Id
  readonly schoolId: Id
  readonly categories: ShopCategory[]
  constructor({ id, schoolId, categories }: ShopProps) {
    this.id = id ?? Id.factory()
    this.schoolId = schoolId
    this.categories = categories
  }
}
