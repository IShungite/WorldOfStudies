import { User } from '#domainModels/user'
import { VerifyCredentialsUseCase } from '#domainPorts/in/user/verify_credentials.use_case'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { inject } from '@adonisjs/core'

@inject()
export class VerifyCredentialsService implements VerifyCredentialsUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async verifyCredentials(email: string, password: string): Promise<User> {
    return this.usersRepository.verifyCredentials(email, password)
  }
}
