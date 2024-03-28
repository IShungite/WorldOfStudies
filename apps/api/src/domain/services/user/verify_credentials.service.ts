import { User } from '#domain/models/user/user'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { inject } from '@adonisjs/core'

@inject()
export class VerifyCredentialsService {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(email: string, password: string): Promise<User> {
    return this.usersRepository.verifyCredentials(email, password)
  }
}
