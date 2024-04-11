import { inject } from '@adonisjs/core'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { User } from '#user/domain/models/user'
import { AccessToken } from '#user/domain/models/access_token'

@inject()
export class CreateTokenService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(user: User): Promise<AccessToken> {
    return this.usersRepository.createToken(user)
  }
}
