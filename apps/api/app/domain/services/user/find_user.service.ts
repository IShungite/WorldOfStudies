import { User } from '#domainModels/user'
import { FindUserUseCase } from '#domainPorts/in/user/find_user.use_case'
import { IUsersRepository } from '#domainPorts/out/user.repository'

export class FindUserService implements FindUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email)
  }
}
