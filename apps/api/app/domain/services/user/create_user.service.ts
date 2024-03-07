import { User } from '#domainModels/user'
import { CreateUserUseCase } from '#domainPorts/in/user/create_user.use_case'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(createUserDto: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<User> {
    const userExists = await this.usersRepository.getByEmail(createUserDto.email)

    if (userExists) {
      throw new Error('User already exists')
    }

    return this.usersRepository.save(new User(createUserDto))
  }
}
