import { User } from '#domainModels/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { UserMapper } from '#mappers/user.mapper'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { Secret } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import UserEntity from '#models/user'

class AccessTokenTest extends AccessToken {
  value: Secret<string>
  constructor(tokenableIdParam?: string) {
    const tokenableId = tokenableIdParam ?? 'tokenTokenableId'
    super({
      identifier: 'tokenIdentifier',
      tokenableId: tokenableId,
      type: 'tokenType',
      hash: 'tokenHash',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: null,
      name: 'tokenName',
    })
    this.value = new Secret(tokenableId)
  }
}

class DbAccessTokensProviderTest extends DbAccessTokensProvider<any> {
  async create(v: User) {
    return new AccessTokenTest(v.email)
  }

  async verify(tokenValue: Secret<string>): Promise<AccessToken | null> {
    const email = tokenValue.release()
    return new AccessTokenTest(email)
  }
}

export default class UserInMemory extends UserEntity {
  static readonly accessTokens = new DbAccessTokensProviderTest({} as any) as any

  constructor(user?: User) {
    super()
    if (user) {
      this.id = Number.parseInt(user.id.toString(), 10)
      this.email = user.email
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.password = user.password
    }
  }

  static async find(email: string): Promise<any> {
    const db = await app.container.make(IUsersRepository)
    const user = await db.getByEmail(email)

    if (!user) return null

    return new UserInMemory(user)
  }
}
