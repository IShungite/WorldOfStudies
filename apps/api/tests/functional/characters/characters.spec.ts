import { Character } from '#domainModels/character'
import { Id } from '#domainModels/id'
import { User } from '#domainModels/user/user'
import { ICharactersRepository } from '#domainPorts/out/characters.repository'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { InMemoryCharactersRepository } from '#repositories/character/in_memory_characters.repository'
import { InMemoryUsersRepository } from '#repositories/user/in_memory_users.repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Characters', (group) => {
  let charactersRepository: ICharactersRepository
  let usersRepository: IUsersRepository

  group.each.setup(async () => {
    charactersRepository = new InMemoryCharactersRepository()
    app.container.swap(ICharactersRepository, () => {
      return charactersRepository
    })
    usersRepository = new InMemoryUsersRepository()
    app.container.swap(IUsersRepository, () => {
      return usersRepository
    })
  })

  test('It should create a character', async ({ client }) => {
    const user = await usersRepository.save(
      new User({ email: 'a@a', firstName: 'a', lastName: 'a', password: 'a' })
    )

    const response = await client
      .post('/characters')
      .json({
        name: 'Shun',
      })
      .loginAs(user as any)
    response.assertStatus(201)
    response.assertBodyContains({ name: 'Shun', userId: user.id.toString() })
  })

  test('It should return the list of characters by user id', async ({ client, assert }) => {
    charactersRepository.save(new Character({ name: 'Shun', userId: new Id('1') }))
    charactersRepository.save(new Character({ name: 'Bou', userId: new Id('2') }))

    const response = await client.get('/characters/user/1')
    response.assertStatus(200)
    assert.lengthOf(response.body(), 1)
  })
})
