import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { ShopCategoryNotFoundException } from '#shop/domain/models/shop_category_not_found.exception'
import { School } from '#school/domain/models/school'
import { Shop } from '#shop/domain/models/shop'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { ItemBuilderTest } from '#tests/builders/item_builder_test'

test.group('Products - store', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository
  let itemsRepository: IItemRepository
  const payload = { itemId: '1', price: 10 }

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
    const response = await client.post('/schools/1/shop/categories/bob/products').json(payload)

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client
      .post(`/schools/${id.toString()}/shop/categories/1/products`)
      .json(payload)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SchoolNotFoundException(id).message)
  })

  test('It should return an exception if the category does not exist', async ({ client }) => {
    const item = await itemsRepository.save(new ItemBuilderTest().build())
    const school = new School({ name: 'School 1' })
    const categoryId = new Id('1')
    const shop = new Shop({
      schoolId: school.id,
      categories: [],
    })
    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])
    await shopsRepository.save(shop)

    const response = await client
      .post(`/schools/${school.id}/shop/categories/${categoryId}/products`)
      .json(payload)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new ShopCategoryNotFoundException(categoryId).message)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const category = new ShopCategory({ name: 'Category 1', products: [] })
    const shop = new Shop({
      schoolId: school.id,
      categories: [category],
    })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client
      .post(`/schools/${school.id}/shop/categories/${category.id}/products`)
      .json({
        name: '',
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a product', async ({ client, assert }) => {
    const item = await itemsRepository.save(new ItemBuilderTest().withId('1').build())
    const school = new School({ name: 'School 1' })
    const category = new ShopCategory({ name: 'Category 1', products: [] })
    const shop = new Shop({
      schoolId: school.id,
      categories: [category],
    })
    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])
    await shopsRepository.save(shop)

    const response = await client
      .post(`/schools/${school.id}/shop/categories/${category.id}/products`)
      .json(payload)

    const updatedShop = await shopsRepository.getBySchoolId(school.id)
    const updatedCategory = updatedShop?.categories.find((c) => c.id.equals(category.id))
    const newProduct = updatedCategory?.products.find((p) => p.item.name === item.name)

    assert.equal(newProduct?.item.name, item.name)
    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader('location', getFullUrl(`/api/schools/${school.id}/shop`))
  })
})
