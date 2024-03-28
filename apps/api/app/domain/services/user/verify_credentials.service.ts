import { User } from '#domainModels/user/user'
import { IUsersRepository } from '#domainPorts/out/users.repository'
import { inject } from '@adonisjs/core'

@inject()
export class VerifyCredentialsService {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(email: string, password: string): Promise<User> {
    return this.usersRepository.verifyCredentials(email, password)
  }
}
