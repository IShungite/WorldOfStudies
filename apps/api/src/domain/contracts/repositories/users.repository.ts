import { AccessToken } from '#domain/models/user/access_token'
import { User } from '#domain/models/user/user'
import { ClearableRepository } from '#infrastructure/repositories/clearable_repository'

export abstract class IUsersRepository implements ClearableRepository {
  abstract save(user: User): Promise<User>
  abstract getByEmail(email: string): Promise<User | null>
  abstract verifyCredentials(email: string, password: string): Promise<User>
  abstract createToken(user: User): Promise<AccessToken>
  abstract empty(): Promise<void>
}
