import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Price } from '#shop/domain/models/price'
import { School } from '#school/domain/models/school'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { Shop } from '#shop/domain/models/shop'
import { Item } from '#item/domain/models/item'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'

test.group('Products - update', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository
  let itemsRepository: IItemRepository

  const item = new Item({ name: 'Item 1' })
  const price = new Price(55)
  const payload = { itemId: item.id.toString(), price: price.toNumber() }

  group.setup(async () => {
    ;[shopsRepository, schoolsRepository, itemsRepository] = await createRepositories([
      IShopsRepository,
      ISchoolsRepository,
      IItemRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([shopsRepository, schoolsRepository, itemsRepository])
  })

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.patch('/schools/1/shop/categories/1/products/bob').json(payload)

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const product = new ShopProduct({ item, price: new Price(100) })
    const category = new ShopCategory({ name: 'Category 1', products: [product] })
    const shop = new Shop({ schoolId: school.id, categories: [category] })
    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])
    await shopsRepository.save(shop)

    const response = await client
      .patch(`/schools/${school.id}/shop/categories/${category.id}/products/${product.id}`)
      .json({
        price: 'bonjour',
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update a product', async ({ client, assert }) => {
    const oldItem = new Item({ name: 'Item 2' })
    const school = new School({ name: 'School 1' })
    const product = new ShopProduct({ item: oldItem, price: new Price(100) })
    const category = new ShopCategory({ name: 'Category 1', products: [product] })
    const shop = new Shop({ schoolId: school.id, categories: [category] })

    await Promise.all([
      itemsRepository.save(item),
      itemsRepository.save(oldItem),
      schoolsRepository.save(school),
    ])
    await shopsRepository.save(shop)

    const response = await client
      .patch(`/schools/${school.id}/shop/categories/${category.id}/products/${product.id}`)
      .json(payload)

    const updatedShop = await shopsRepository.getBySchoolId(school.id)
    const updatedCategory = updatedShop?.categories.find((c) => c.id.equals(category.id))
    const updatedProduct = updatedCategory?.products.find((p) => p.id.equals(product.id))

    assert.equal(updatedProduct?.item.name, item.name)
    assert.equal(updatedProduct?.price.toNumber(), price.toNumber())

    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader('location', getFullUrl(`/api/schools/${school.id}/shop`))
  })
})
