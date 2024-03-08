import { User } from '#domainModels/user/user'

export interface CreateTokenUseCase {
  createToken(user: User): Promise<{ type: string; value: string }>
}
