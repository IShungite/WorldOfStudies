import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { getUrl } from '#shared/infra/api/utils/get_url'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { Shop } from '#shop/domain/models/shop'

test.group('Categories - update', (group) => {
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
    const response = await client.patch('/schools/1/shop/categories/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const category = new ShopCategory({ name: 'Category 1', products: [] })
    const shop = new Shop({ schoolId: school.id, categories: [category] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client
      .patch(`/schools/${school.id}/shop/categories/${category.id}`)
      .json({
        name: '',
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update a category', async ({ client, assert }) => {
    const school = new School({ name: 'School 1' })
    const category = new ShopCategory({ name: 'Category 1', products: [] })
    const shop = new Shop({ schoolId: school.id, categories: [category] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client
      .patch(`/schools/${school.id}/shop/categories/${category.id}`)
      .json({
        id: category.id.toString(),
        name: 'Category 2',
      })

    const updatedShop = await shopsRepository.getBySchoolId(school.id)

    assert.equal(updatedShop?.categories.find((c) => c.id.equals(category.id))?.name, 'Category 2')

    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader('location', getUrl(`/api/schools/${school.id}/shop`))
  })
})
