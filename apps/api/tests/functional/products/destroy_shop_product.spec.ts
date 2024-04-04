import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IShopsRepository } from '#domain/contracts/repositories/shops.repository'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { School } from '#domain/models/school/school'
import { Shop } from '#domain/models/shop/shop'
import { ShopCategory } from '#domain/models/shop/shop_category'
import { Id } from '#domain/models/id/id'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { ShopCategoryNotFoundException } from '#domain/models/shop/shop_category_not_found_exception'
import { ShopProduct } from '#domain/models/shop/shop_product'
import { Price } from '#domain/models/shop/price'
import { ShopProductNotFoundException } from '#domain/models/shop/shop_product_not_found_exception'

test.group('Products - destroy', (group) => {
  let shopsRepository: IShopsRepository
  let schoolsRepository: ISchoolsRepository

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
    const response = await client.delete('/schools/1/shop/categories/1/products/bob')

    response.assertStatus(StatusCodes.NOT_FOUND)
  })

  test('It should return an exception if the school does not exist', async ({ client }) => {
    const id = new Id('1')
    const response = await client.delete(`/schools/${id.toString()}/shop/categories/1/products/1`)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new SchoolNotFoundException(id).message)
  })

  test('It should return an exception if the category does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const categoryId = new Id('1')
    const shop = new Shop({
      schoolId: school.id,
      categories: [],
    })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.delete(
      `/schools/${school.id.toString()}/shop/categories/${categoryId.toString()}/products/1`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new ShopCategoryNotFoundException(categoryId).message)
  })

  test('It should return an exception if the product does not exist', async ({ client }) => {
    const school = new School({ name: 'School 1' })
    const productId = new Id('1')
    const category = new ShopCategory({ name: 'Category 1', products: [] })
    const shop = new Shop({
      schoolId: school.id,
      categories: [category],
    })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.delete(
      `/schools/${school.id.toString()}/shop/categories/${category.id.toString()}/products/${productId.toString()}`
    )

    response.assertStatus(StatusCodes.BAD_REQUEST)
    response.assertTextIncludes(new ShopProductNotFoundException(productId).message)
  })

  test('It should delete a product', async ({ client, assert }) => {
    const school = new School({ name: 'School 1' })
    const product = new ShopProduct({ name: 'Product 1', price: new Price(10.0) })
    const category = new ShopCategory({ name: 'Category 1', products: [product] })
    const shop = new Shop({
      schoolId: school.id,
      categories: [category],
    })
    await schoolsRepository.save(school)
    await shopsRepository.save(shop)

    const response = await client.delete(
      `/schools/${school.id.toString()}/shop/categories/${category.id.toString()}/products/${product.id.toString()}`
    )

    const updatedShop = await shopsRepository.getBySchoolId(school.id)
    const updatedCategory = updatedShop?.categories.find((c) => c.id.equals(category.id))
    const deletedProduct = updatedCategory?.products.find((p) => p.id.equals(product.id))

    assert.isUndefined(deletedProduct)
    response.assertStatus(StatusCodes.NO_CONTENT)
  })
})
