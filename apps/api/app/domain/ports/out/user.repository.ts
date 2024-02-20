import { User } from '#domainModels/user'

export abstract class IUsersRepository {
  abstract store(user: User): Promise<User>
  abstract findByEmail(email: string): Promise<User | null>
  abstract verifyCredentials(email: string, password: string): Promise<User>
  abstract createToken(user: User): Promise<{ type: string; value: string }>
}
