import { AccessToken } from '#domainModels/user/access_token'
import { User } from '#domainModels/user/user'
import { IUsersRepository } from '#domainPorts/out/users.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateTokenService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(user: User): Promise<AccessToken> {
    return this.usersRepository.createToken(user)
  }
}
