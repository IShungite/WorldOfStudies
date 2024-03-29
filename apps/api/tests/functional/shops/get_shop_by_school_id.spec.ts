import { School } from '#domain/models/school/school'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { Shop } from '#domain/models/shop/shop'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'

test.group('Shops - get by school id', (group) => {
  let schoolsRepository: ISchoolsRepository
  let shopsRepository: IShopsRepository

  group.setup(async () => {
    ;[schoolsRepository, shopsRepository] = await createRepositories([
      ISchoolsRepository,
      IShopsRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository, shopsRepository])
  })

  test('It should return a 400 if the shop not found', async ({ client }) => {
    const response = await client.get(`/schools/1/shop`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return the shop of the school', async ({ client }) => {
    const school = new School({
      name: 'School 1',
      promotions: [],
    })
    const shop = new Shop({
      schoolId: school.id,
      categories: [],
    })

    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.get(`/schools/${school.id.toString()}/shop`)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ id: shop.id.toString() })
  })
})
