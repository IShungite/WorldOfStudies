import { role } from '#domainModels/user/role'
import { CreateUserDto, User } from '#domainModels/user/user'
import { UserAlreadyExistsException } from '#domainModels/user/user_already_exists.exception'
import { IUsersRepository } from '#domainPorts/out/users.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateUserService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.getByEmail(createUserDto.email)

    if (userExists) {
      throw new UserAlreadyExistsException()
    }

    return this.usersRepository.save(new User({ ...createUserDto, role: role.STUDENT }))
  }
}
