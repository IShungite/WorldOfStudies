import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { School } from '#domain/models/school/school'
import { getUrl } from '#utils/get_url'
import { Shop } from '#domain/models/shop/shop'
import { ShopCategory } from '#domain/models/shop/shop_category'
import { Id } from '#domain/models/id/id'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { ShopCategoryNotFoundException } from '#domain/models/shop/shop_category_not_found_exception'

test.group('Products - store', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository
  const payload = { name: 'Product 1', price: 10 }

  group.setup(async () => {
    ;[shopsRepository, schoolsRepository] = await createRepositories([
      IShopsRepository,
      ISchoolsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([shopsRepository, schoolsRepository])
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
    const school = new School({ name: 'School 1' })
    const categoryId = new Id('1')
    const shop = new Shop({
      schoolId: school.id,
      categories: [],
    })
    await schoolsRepository.save(school)
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
      .json(payload)

    const updatedShop = await shopsRepository.getBySchoolId(school.id)
    const updatedCategory = updatedShop?.categories.find((c) => c.id.equals(category.id))
    const newProduct = updatedCategory?.products.find((p) => p.name === payload.name)

    assert.equal(newProduct?.name, payload.name)
    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader('location', getUrl(`schools/${school.id}/shop`))
  })
})
