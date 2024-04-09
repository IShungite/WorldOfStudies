import { User } from '../models/user.js'
import { IUsersRepository } from '../contracts/repositories/users.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class VerifyCredentialsService {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async execute(email: string, password: string): Promise<User> {
    return this.usersRepository.verifyCredentials(email, password)
  }
}
