import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { School } from '#school/domain/models/school'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { Item } from '#item/domain/models/item'

test.group('Shops - store', (group) => {
  let schoolsRepository: ISchoolsRepository
  let shopsRepository: IShopsRepository
  let itemsRepository: IItemRepository

  group.setup(async () => {
    ;[schoolsRepository, shopsRepository, itemsRepository] = await createRepositories([
      ISchoolsRepository,
      IShopsRepository,
      IItemRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([schoolsRepository, shopsRepository, itemsRepository])
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
              itemId: '1',
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
    const item = new Item({ name: 'Item 1' })
    const school = new School({
      name: 'School 1',
      promotions: [],
    })
    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])

    const response = await client.post('/shops').json({
      schoolId: school.id.toString(),
      categories: [
        {
          name: 'Category 1',
          products: [
            {
              itemId: item.id.toString(),
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
