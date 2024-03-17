import { AccessToken } from '#domainModels/user/access_token'
import { User } from '#domainModels/user/user'

export abstract class IUsersRepository {
  abstract save(user: User): Promise<User>
  abstract getByEmail(email: string): Promise<User | null>
  abstract verifyCredentials(email: string, password: string): Promise<User>
  abstract createToken(user: User): Promise<AccessToken>
  abstract empty(): Promise<void>
}
