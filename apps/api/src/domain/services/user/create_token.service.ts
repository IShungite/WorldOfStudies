import { AccessToken } from '#domain/models/user/access_token'
import { User } from '#domain/models/user/user'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateTokenService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(user: User): Promise<AccessToken> {
    return this.usersRepository.createToken(user)
  }
}
