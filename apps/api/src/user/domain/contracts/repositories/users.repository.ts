import { ClearableRepository } from '#shared/infra/storage/clearable_repository'
import { AccessToken } from '#user/domain/models/access_token'
import { User } from '#user/domain/models/user'

export abstract class IUsersRepository implements ClearableRepository {
  abstract save(user: User): Promise<User>
  abstract getByEmail(email: string): Promise<User | null>
  abstract verifyCredentials(email: string, password: string): Promise<User>
  abstract createToken(user: User): Promise<AccessToken>
  abstract empty(): Promise<void>
}
