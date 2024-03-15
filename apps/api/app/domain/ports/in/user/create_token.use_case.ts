import { AccessToken } from '#domainModels/user/access_token'
import { User } from '#domainModels/user/user'

export interface CreateTokenUseCase {
  createToken(user: User): Promise<AccessToken>
}
