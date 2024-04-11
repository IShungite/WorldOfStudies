import { ApiRequest } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { User } from '#user/domain/models/user'

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
