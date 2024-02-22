import { User } from '#domainModels/user'

export interface CreateUserUseCase {
  createUser: (user: User) => Promise<User>
}
