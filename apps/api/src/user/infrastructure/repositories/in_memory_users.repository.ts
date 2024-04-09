import { AccessToken } from '../../domain/models/access_token.js'
import { InvalidCredentialsException } from '../../domain/models/invalid_credentials.exception.js'
import { User } from '../../domain/models/user.js'
import { IUsersRepository } from '../../domain/contracts/repositories/users.repository.js'
import { CreateTestJwtService } from '#utils/create_test_jwt'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: Record<string, User> = {}

  async getByEmail(email: string): Promise<User | null> {
    return Object.values(this.users).find((user) => user.email === email) ?? null
  }

  async createToken(user: User): Promise<AccessToken> {
    const jwtToken = CreateTestJwtService.create(user.email)

    const token = new AccessToken({
      type: 'auth_token',
      token: jwtToken,
      role: user.role,
    })

    return token
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
