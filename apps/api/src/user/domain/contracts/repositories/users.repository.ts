import { AccessToken } from '../../models/access_token.js'
import { User } from '../../models/user.js'
import { ClearableRepository } from '../../../../shared/clearable_repository.js'

export abstract class IUsersRepository implements ClearableRepository {
  abstract save(user: User): Promise<User>
  abstract getByEmail(email: string): Promise<User | null>
  abstract verifyCredentials(email: string, password: string): Promise<User>
  abstract createToken(user: User): Promise<AccessToken>
  abstract empty(): Promise<void>
}
