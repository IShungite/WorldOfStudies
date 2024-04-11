import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { School } from '#school/domain/models/school'
import { Shop } from '#shop/domain/models/shop'

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
