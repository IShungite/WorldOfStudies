import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import emptyRepositories from '#tests/utils/empty_repositories'
import createRepositories from '#tests/utils/create_repositories'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { IShopsRepository } from '#shop/domain/contracts/repositories/shops.repository'
import { School } from '#school/domain/models/school'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'
import { Shop } from '#shop/domain/models/shop'
import { ShopCategory } from '#shop/domain/models/shop_category'
import { ShopProduct } from '#shop/domain/models/shop_product'
import { Price } from '#shop/domain/models/price'
import { Promotion } from '#school/domain/models/promotion'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { PurchaseProductResponse } from '@world-of-studies/api-types'
import { ItemBuilderTest } from '#tests/builders/item_builder_test'

test.group('Shops - purchase product', (group) => {
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository
  let shopsRepository: IShopsRepository
  let itemsRepository: IItemRepository
  let charactersRepository: ICharactersRepository
  let inventoriesRepository: IInventoriesRepository

  const promotion = new Promotion({
    name: 'Promotion 1',
    year: 2022,
  })
  const school = new School({
    name: 'School 1',
    promotions: [promotion],
  })
  const user = new UserBuilderTest().build()

  group.setup(async () => {
    ;[
      usersRepository,
      schoolsRepository,
      shopsRepository,
      itemsRepository,
      charactersRepository,
      inventoriesRepository,
    ] = await createRepositories([
      IUsersRepository,
      ISchoolsRepository,
      IShopsRepository,
      IItemRepository,
      ICharactersRepository,
      IInventoriesRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([
      usersRepository,
      schoolsRepository,
      shopsRepository,
      itemsRepository,
      charactersRepository,
      inventoriesRepository,
    ])

    await Promise.all([usersRepository.save(user), schoolsRepository.save(school)])
  })

  test('It should return a 401 if not authenticated ', async ({ client }) => {
    const payload = {
      characterId: '1',
    }

    const response = await client.post('/shops/1/products/1/purchase').json(payload)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
  })

  test('It should return a 422 if the payload is invalid', async ({ client }) => {
    const payload = {}

    const response = await client.post('/shops/1/products/1/purchase').json(payload).loginWith(user)

    response.assertStatus(StatusCodes.UNPROCESSABLE_ENTITY)
  })

  test('It should return a 400 if the character is not found', async ({ client }) => {
    const payload = {
      characterId: '1',
    }

    const response = await client.post('/shops/1/products/1/purchase').json(payload).loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 400 if the user does not own the character', async ({ client }) => {
    const user2 = await usersRepository.save(new UserBuilderTest().build())

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user2).withPromotion(promotion).build()
    )
    const payload = {
      characterId: character.id.toString(),
    }

    const response = await client.post('/shops/1/products/1/purchase').json(payload).loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
    // TODO response message
  })

  test('It should return a 400 if the product is not found', async ({ client }) => {
    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(promotion).build()
    )
    const payload = {
      characterId: character.id.toString(),
    }

    const response = await client.post('/shops/1/products/1/purchase').json(payload).loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 400 if character does not have enough berries', async ({ client }) => {
    const item = await itemsRepository.save(new ItemBuilderTest().build())
    const shopProduct = new ShopProduct({
      item: item,
      price: new Price(5),
    })
    const shop = new Shop({
      schoolId: school.id,
      categories: [
        new ShopCategory({
          name: 'Category 1',
          products: [shopProduct],
        }),
      ],
    })

    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])
    await shopsRepository.save(shop)

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(promotion).build()
    )
    const payload = {
      characterId: character.id.toString(),
    }

    const response = await client
      .post(`/shops/${shop.id.toString()}/products/${shopProduct.id.toString()}/purchase`)
      .json(payload)
      .loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 200 and add the item in the character inventory', async ({
    client,
    assert,
  }) => {
    const item = await itemsRepository.save(new ItemBuilderTest().build())
    const shopProduct = new ShopProduct({
      item: item,
      price: new Price(5),
    })
    const shop = new Shop({
      schoolId: school.id,
      categories: [
        new ShopCategory({
          name: 'Category 1',
          products: [shopProduct],
        }),
      ],
    })

    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])
    await shopsRepository.save(shop)

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(promotion).withBerries(10).build()
    )
    await inventoriesRepository.saveForCharacter(character.id, new Inventory({ items: [] }))

    const payload = {
      characterId: character.id.toString(),
    }

    const response = await client
      .post(`/shops/${shop.id.toString()}/products/${shopProduct.id.toString()}/purchase`)
      .json(payload)
      .loginWith(user)

    const characterInventory = await inventoriesRepository.getByCharacterId(character.id)
    const characterItems = characterInventory!.items
    response.assertStatus(StatusCodes.OK)
    assert.lengthOf(characterItems, 1)
    assert.equal(characterItems[0].item.id.toString(), item.id.toString())
  })

  test('It should decrease the character berries', async ({ client, assert }) => {
    const item = await itemsRepository.save(new ItemBuilderTest().build())
    const shopProduct = new ShopProduct({
      item: item,
      price: new Price(5),
    })
    const shop = new Shop({
      schoolId: school.id,
      categories: [
        new ShopCategory({
          name: 'Category 1',
          products: [shopProduct],
        }),
      ],
    })

    await Promise.all([itemsRepository.save(item), schoolsRepository.save(school)])
    await shopsRepository.save(shop)

    const character = await charactersRepository.save(
      new CharacterBuilderTest().withUser(user).withPromotion(promotion).withBerries(10).build()
    )
    await inventoriesRepository.saveForCharacter(character.id, new Inventory({ items: [] }))

    const payload = {
      characterId: character.id.toString(),
    }

    const response = await client
      .post(`/shops/${shop.id.toString()}/products/${shopProduct.id.toString()}/purchase`)
      .json(payload)
      .loginWith(user)

    const body: PurchaseProductResponse = response.body()

    assert.equal(body.result.berries, character.berries - shopProduct.price.toNumber())
  })
})
