import { User } from '#domain/models/user/user'
import { IUsersRepository } from '#domain/contracts/repositories/users.repository'
import { CreateTestJwtService } from '#utils/test_jwt/create_test_jwt.service'
import UserEntity from '#infrastructure/entities/user'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { Secret } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export class AccessTokenTest extends AccessToken {
  value: Secret<string>
  constructor(tokenableId: string) {
    super({
      identifier: 'tokenIdentifier',
      tokenableId: tokenableId,
      type: 'auth_token',
      hash: 'tokenHash',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: null,
      name: 'bearer',
    })
    const jwtToken = CreateTestJwtService.create(tokenableId)

    this.value = new Secret(jwtToken)
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

export default class UserEntityForAuthWhenInMemory extends UserEntity {
  static readonly accessTokens = new DbAccessTokensProviderTest({} as any) as any

  constructor(user: User) {
    super()
    this.id = Number.parseInt(user.id.toString(), 10)
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.password = user.password
    this.role = user.role
  }

  static async find(token: string): Promise<any> {
    const decodedValue = CreateTestJwtService.verify(token)

    if (!decodedValue) return null

    const db = await app.container.make(IUsersRepository)
    const user = await db.getByEmail(decodedValue.email)

    if (!user) return null

    return new UserEntityForAuthWhenInMemory(user)
  }
}
