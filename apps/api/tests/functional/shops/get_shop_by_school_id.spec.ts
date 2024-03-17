import { School } from '#domainModels/school/school'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { InMemoryShopsRepository } from '#repositories/shop/in_memory_shops.repository'
import { Shop } from '#domainModels/shop/shop'

test.group('Shops - get by school id', (group) => {
  let shopsRepository: IShopsRepository

  group.each.setup(async () => {
    shopsRepository = new InMemoryShopsRepository()
    app.container.swap(IShopsRepository, () => {
      return shopsRepository
    })
  })

  test('It should return a 400 if the shop not found', async ({ client }) => {
    const response = await client.get(`/schools/1/shop`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return the shop', async ({ client }) => {
    const school = new School({
      name: 'School 1',
      promotions: [],
    })
    const shop = new Shop({
      schoolId: school.id,
      categories: [],
    })

    await shopsRepository.save(shop)

    const response = await client.get(`/schools/${school.id.toString()}/shop`)

    response.assertStatus(StatusCodes.OK)
    response.assertBodyContains({ id: shop.id.toString() })
  })
})
