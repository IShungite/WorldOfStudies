import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IShopsRepository } from '../../../src/shop/domain/contracts/repositories/shops.repository.js'
import { ISchoolsRepository } from '../../../src/school/domain/contracts/repositories/schools.repository.js'
import { School } from '../../../src/school/domain/models/school.js'
import { Shop } from '../../../src/shop/domain/models/shop.js'
import { ShopCategory } from '../../../src/shop/domain/models/shop_category.js'

test.group('Categories - destroy', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository

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
    const response = await client.delete('/schools/1/shop/categories/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 404 if the school does not exist', async ({ client }) => {
    const response = await client.delete('/schools/1/shop/categories/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 400 if the category does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const shop = new Shop({
      schoolId: school.id,
      categories: [],
    })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.delete('/schools/1/shop/categories/1')

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should delete a category', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const category = new ShopCategory({ name: 'Category 1', products: [] })
    const shop = new Shop({
      schoolId: school.id,
      categories: [category],
    })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.delete(`/schools/${school.id}/shop/categories/${category.id}`)

    response.assertStatus(StatusCodes.NO_CONTENT)
  })
})
