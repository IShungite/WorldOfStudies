import { School } from '#domainModels/school/school'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { Shop } from '#domainModels/shop/shop'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'

test.group('Shops - get by school id', (group) => {
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
