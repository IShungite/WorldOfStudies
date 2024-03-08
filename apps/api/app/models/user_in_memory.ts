import { User } from '#domainModels/user/user'
import { IUsersRepository } from '#domainPorts/out/user.repository'
import { CreateTestJwtService } from '../adapters/utils/test_jwt/create_test_jwt.service.js'
import UserEntity from '#models/user'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { Secret } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import jwt from 'jsonwebtoken'

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
    const decodedValue = CreateTestJwtService.verify(email)

    const db = await app.container.make(IUsersRepository)
    const user = await db.getByEmail(decodedValue.email)

    if (!user) return null

    return new UserInMemory(user)
  }
}
