import { role } from '#domainModels/user/role'
import { CreateUserDto, User } from '#domainModels/user/user'
import { UserAlreadyExistsException } from '#domainModels/user/user_already_exists.exception'
import { CreateUserUseCase } from '#domainPorts/in/user/create_user.use_case'
import { IUsersRepository } from '#domainPorts/out/users.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserService implements CreateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.getByEmail(createUserDto.email)

    if (userExists) {
      throw new UserAlreadyExistsException()
    }

    return this.usersRepository.save(new User({ ...createUserDto, role: role.STUDENT }))
  }
}
