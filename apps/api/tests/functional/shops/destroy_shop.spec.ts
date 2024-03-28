import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { School } from '#domain/models/school/school'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { Shop } from '#domain/models/shop/shop'
import { Id } from '#domain/models/id/id'

test.group('Shops - destroy', (group) => {
  let schoolsRepository: ISchoolsRepository
  let shopsRepository: IShopsRepository

  group.setup(async () => {
    ;[schoolsRepository, shopsRepository] = await Promise.all([
      app.container.make(ISchoolsRepository),
      app.container.make(IShopsRepository),
    ])
  })

  group.each.setup(async () => {
    await Promise.all([schoolsRepository.empty(), shopsRepository.empty()])
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
