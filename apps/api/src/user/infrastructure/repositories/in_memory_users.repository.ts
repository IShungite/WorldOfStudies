import { CreateTestJwtService } from '#shared/utils/create_test_jwt'
import { IUsersRepository } from '#user/domain/contracts/repositories/users.repository'
import { AccessToken } from '#user/domain/models/access_token'
import { InvalidCredentialsException } from '#user/domain/models/invalid_credentials.exception'
import { User } from '#user/domain/models/user'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: Record<string, User> = {}

  async getByEmail(email: string): Promise<User | null> {
    return Object.values(this.users).find((user) => user.email === email) ?? null
  }

  async createToken(user: User): Promise<AccessToken> {
    const jwtToken = CreateTestJwtService.create(user.email)

    return new AccessToken({
      type: 'auth_token',
      token: jwtToken,
      role: user.role,
    })
  }

  async save(user: User): Promise<User> {
    this.users[user.id.toString()] = user
    return user
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    const user = await this.getByEmail(email)
    if (user && user.password === password) {
      return user
    }

    throw new InvalidCredentialsException()
  }

  async empty(): Promise<void> {
    this.users = {}
  }
}
