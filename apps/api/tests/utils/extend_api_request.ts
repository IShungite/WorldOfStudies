import { User } from '../../src/user/domain/models/user.js'
import { IUsersRepository } from '../../src/user/domain/contracts/repositories/users.repository.js'
import { ApiRequest } from '@japa/api-client'
import app from '@adonisjs/core/services/app'

declare module '@japa/api-client' {
  // Interface must match the class name
  interface ApiRequest {
    loginWith(user: User): Promise<this>
  }
}

ApiRequest.macro('loginWith', async function (user) {
  const usersRepository = await app.container.make(IUsersRepository)

  const token = await usersRepository.createToken(user)

  // @ts-ignore
  this.header('Authorization', `Bearer ${token.token}`)

  // @ts-ignore
  return this
})
