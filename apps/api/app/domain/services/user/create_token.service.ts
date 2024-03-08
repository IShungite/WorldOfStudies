import { AccessToken } from '#domainModels/user/access_token'
import { User } from '#domainModels/user/user'
import { CreateTokenUseCase } from '#domainPorts/in/user/create_token.use_case'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateTokenService implements CreateTokenUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createToken(user: User): Promise<AccessToken> {
    return this.usersRepository.createToken(user)
  }
}
