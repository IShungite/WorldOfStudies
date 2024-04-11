import { inject } from '@adonisjs/core'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { User } from '#user/domain/models/user'

@inject()
export class VerifyCredentialsService {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(email: string, password: string): Promise<User> {
    return this.usersRepository.verifyCredentials(email, password)
  }
}
