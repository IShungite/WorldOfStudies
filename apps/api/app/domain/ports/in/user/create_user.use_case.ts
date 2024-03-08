import { User } from '#domainModels/user/user'

export interface CreateUserUseCase {
  createUser: (user: User) => Promise<User>
}
