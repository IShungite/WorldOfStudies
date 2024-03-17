import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { InMemorySchoolsRepository } from '#repositories/in_memory_schools.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { IShopsRepository } from '#domainPorts/out/shops.repository'
import { InMemoryShopsRepository } from '#repositories/shop/in_memory_shops.repository'

test.group('Shops - store', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository

  group.each.setup(async () => {
    shopsRepository = new InMemoryShopsRepository()
    app.container.swap(IShopsRepository, () => {
      return shopsRepository
    })

    schoolsRepository = new InMemorySchoolsRepository()
    app.container.swap(ISchoolsRepository, () => {
      return schoolsRepository
    })
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('/shops').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 400 if the school does not exist', async ({ client }) => {
    const response = await client.post('/shops').json({
      schoolId: '1',
      categories: [],
    })

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should create a shop', async ({ client, assert }) => {
    const school = new School({
      name: 'School 1',
      promotions: [],
    })
    await schoolsRepository.save(school)

    const response = await client.post('/shops').json({
      schoolId: school.id.toString(),
      categories: [
        {
          name: 'Category 1',
          products: [
            {
              name: 'Product 1',
              price: 100,
            },
          ],
        },
      ],
    })

    const createdShop = await shopsRepository.getBySchoolId(school.id)

    response.assertStatus(StatusCodes.CREATED)
    response.assertBodyContains({ schoolId: school.id.toString() })

    assert.isNotNull(createdShop)
    assert.isTrue(createdShop?.schoolId.equals(school.id))
  })
})
