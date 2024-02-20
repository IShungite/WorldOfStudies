import { User } from '#domainModels/user'
import { CreateTokenUseCase } from '#domainPorts/in/user/create_token.use_case'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateTokenService implements CreateTokenUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createToken(user: User): Promise<{ type: string; value: string }> {
    return this.usersRepository.createToken(user)
  }
}
