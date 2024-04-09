import { AccessToken } from '../models/access_token.js'
import { User } from '../models/user.js'
import { IUsersRepository } from '../contracts/repositories/users.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class CreateTokenService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(user: User): Promise<AccessToken> {
    return this.usersRepository.createToken(user)
  }
}
