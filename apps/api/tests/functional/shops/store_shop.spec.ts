import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { School } from '#school/domain/models/school'

test.group('Shops - store', (group) => {
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

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const response = await client.post('/shops').json({})

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 400 if the price is negative', async ({ client }) => {
    const payload = {
      schoolId: '1',
      categories: [
        {
          name: 'Category 1',
          products: [
            {
              name: 'Product 1',
              price: -10,
            },
          ],
        },
      ],
    }

    const response = await client.post('/shops').json(payload)

    response.assertStatus(StatusCodes.BAD_REQUEST)
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
