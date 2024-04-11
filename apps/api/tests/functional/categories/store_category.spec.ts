import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { getUrl } from '#shared/infra/api/utils/get_url'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { School } from '#school/domain/models/school'
import { Shop } from '#shop/domain/models/shop'

test.group('Categories - store', (group) => {
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
    const response = await client.post('/schools/bob/shop/categories')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const shop = new Shop({ schoolId: school.id, categories: [] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.post(`/schools/${school.id}/shop/categories`).json({
      name: '',
    })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should create a category', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const shop = new Shop({ schoolId: school.id, categories: [] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.post(`/schools/${school.id}/shop/categories`).json({
      name: 'Category 1',
      products: [],
    })

    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader('location', getUrl(`schools/${school.id}/shop`))
  })
})
