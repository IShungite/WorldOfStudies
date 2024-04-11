import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { getUrl } from '#shared/infra/api/utils/get_url'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Price } from '#shop/domain/models/price'
import { School } from '#school/domain/models/school'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { Shop } from '#shop/domain/models/shop'

test.group('Products - update', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository
  const payload = { name: 'Product 55', price: 55 }

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
    const response = await client.patch('/schools/1/shop/categories/1/products/bob').json(payload)

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return a 422 when the payload is invalid', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const product = new ShopProduct({ name: 'Product 1', price: new Price(100) })
    const category = new ShopCategory({ name: 'Category 1', products: [product] })
    const shop = new Shop({ schoolId: school.id, categories: [category] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client
      .patch(`/schools/${school.id}/shop/categories/${category.id}/products/${product.id}`)
      .json({
        price: 'bonjour',
      })

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should update a product', async ({ client, assert }) => {
    const school = new School({ name: 'School 1' })
    const product = new ShopProduct({ name: 'Product 1', price: new Price(100) })
    const category = new ShopCategory({ name: 'Category 1', products: [product] })
    const shop = new Shop({ schoolId: school.id, categories: [category] })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client
      .patch(`/schools/${school.id}/shop/categories/${category.id}/products/${product.id}`)
      .json(payload)

    const updatedShop = await shopsRepository.getBySchoolId(school.id)
    const updatedCategory = updatedShop?.categories.find((c) => c.id.equals(category.id))
    const updatedProduct = updatedCategory?.products.find((p) => p.id.equals(product.id))
    const expectedPrice = new Price(55)

    assert.equal(updatedProduct?.name, payload.name)
    assert.deepEqual(updatedProduct?.price, expectedPrice)

    response.assertStatus(StatusCodes.NO_CONTENT)
    response.assertHeader('location', getUrl(`schools/${school.id}/shop`))
  })
})
