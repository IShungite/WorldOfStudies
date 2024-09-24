import { test } from '@japa/runner'
import { StatusCodes } from 'http-status-codes'
import { UserBuilderTest } from '#tests/builders/user_builder_test'
import createRepositories from '#tests/utils/create_repositories'
import emptyRepositories from '#tests/utils/empty_repositories'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { ICharactersRepository } from '#character/domain/contracts/repositories/characters.repository'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CharacterBuilderTest } from '#tests/builders/character_builder_test'
import { SchoolBuilderTest } from '#tests/builders/school_builder_test'
import { IInventoriesRepository } from '#inventory/domain/contracts/repositories/inventories.repository'
import { Inventory } from '#inventory/domain/models/inventory'
import { IItemRepository } from '#item/domain/contracts/items_repository.contract'
import { Item } from '#item/domain/models/item'
import { InventoryItem } from '#inventory/domain/models/inventory_item'
import { InventoryResponse } from '@world-of-studies/api-types'
import { ItemType } from '#shared/enums/item_type'

test.group('Characters - get inventory', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository
  let schoolsRepository: ISchoolsRepository
  let inventoriesRepository: IInventoriesRepository
  let itemsRepository: IItemRepository

  const user = new UserBuilderTest().build()
  const school = new SchoolBuilderTest().withRandomPromotionsAndSubjects(1, 0).build()
  const character = new CharacterBuilderTest()
    .withUser(user)
    .withPromotion(school.promotions[0])
    .build()

  group.setup(async () => {
    ;[
      charactersRepository,
      usersRepository,
      schoolsRepository,
      inventoriesRepository,
      itemsRepository,
    ] = await createRepositories([
      ICharactersRepository,
      IUsersRepository,
      ISchoolsRepository,
      IInventoriesRepository,
      IItemRepository,
    ])
  })

  group.each.setup(async () => {
    await emptyRepositories([
      charactersRepository,
      usersRepository,
      schoolsRepository,
      inventoriesRepository,
      itemsRepository,
    ])

    await Promise.all([usersRepository.save(user), schoolsRepository.save(school)])
    await charactersRepository.save(character)
  })

  test('It should return 401 when user is not authenticated', async ({ client }) => {
    const response = await client.get(`/characters/${character.id.toString()}/inventory`)

    response.assertStatus(StatusCodes.UNAUTHORIZED)
    response.assertTextIncludes('Unauthorized access')
  })

  test('It should return 400 if the character does not exist', async ({ client }) => {
    const response = await client.get(`/characters/1/inventory`).loginWith(user)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return 400 if the user is not the owner', async ({ client }) => {
    const user2 = await usersRepository.save(new UserBuilderTest().build())

    const response = await client
      .get(`/characters/${character.id.toString()}/inventory`)
      .loginWith(user2)

    response.assertStatus(StatusCodes.BAD_REQUEST)
  })

  test('It should return a 200 if everything goes well', async ({ client, assert }) => {
    const item = new Item({
      name: 'Item 1',
      type: ItemType.Misc,
      image: 'image.png',
      icon: 'icon.png',
    })
    await itemsRepository.save(item)
    await inventoriesRepository.saveForCharacter(
      character.id,
      new Inventory({ items: [new InventoryItem({ item })] })
    )

    const response = await client
      .get(`/characters/${character.id.toString()}/inventory`)
      .loginWith(user)
    const body = response.body() as InventoryResponse

    response.assertStatus(StatusCodes.OK)
    assert.equal(body.result.items.length, 1)
    assert.equal(body.result.items[0].name, item.name)
  })
})
