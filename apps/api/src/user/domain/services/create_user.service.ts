import { role } from '../models/role.js'
import { CreateUserDto, User } from '../models/user.js'
import { UserAlreadyExistsException } from '../models/user_already_exists.exception.js'
import { IUsersRepository } from '../contracts/repositories/users.repository.js'
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
