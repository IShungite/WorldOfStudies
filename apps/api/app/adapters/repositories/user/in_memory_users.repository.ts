import { User } from '#domainModels/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: Record<string, User> = {}

  async getByEmail(email: string): Promise<User | null> {
    return Object.values(this.users).find((user) => user.email === email) ?? null
  }

  async createToken(user: User): Promise<{ type: string; value: string }> {
    return {
      type: 'Bearer',
      value: 'xxxxxxxxx',
    }
  }

  async create(user: User): Promise<User> {
    this.users[user.id.toString()] = user
    return user
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    const user = await this.getByEmail(email)
    if (user && user.password === password) {
      return user
    }

    throw new Error('Invalid credentials')
  }
}
