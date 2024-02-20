import { User } from '#domainModels/user'

export interface FindUserUseCase {
  findByEmail(email: string): Promise<User | null>
}
