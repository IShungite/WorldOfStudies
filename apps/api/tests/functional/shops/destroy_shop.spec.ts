import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { Id } from '#shared/id/domain/models/id'
import { School } from '#school/domain/models/school'
import { Shop } from '#shop/domain/models/shop'

test.group('Shops - destroy', (group) => {
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

  test('It should return a 404 if one or more params are not a number', async ({ client }) => {
    const response = await client.delete(`/schools/bob/shop`)

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 400 if the shop does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    await schoolsRepository.save(school)

    const response = await client.delete(`/schools/${school.id}/shop`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should destroy the shop', async ({ client }) => {
    const schoolId = new Id('1')
    const school = new School({ id: schoolId, name: 'School 1' })
    const shop = new Shop({ schoolId: schoolId, categories: [] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.delete(`/schools/${schoolId}/shop`)

    response.assertStatus(StatusCodes.NO_CONTENT)
  })
})
