import { inject } from '@adonisjs/core'
import { UserAlreadyExistsException } from '#user/domain/models/user_already_exists.exception'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { CreateUserDto, User } from '#user/domain/models/user'
import { role } from '#user/domain/models/role'

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
